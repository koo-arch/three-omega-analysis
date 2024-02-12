import re
import numpy as np
from itertools import combinations


class MeasurementFileParser:
    def __init__(self, data, file_data):
        self.data = data
        self.file_data = file_data
        self.error_points = []

    def _get_measurement_condition(self, file_name) -> tuple[float, int]:
        current_match = re.search(r"(\d+)mA", file_name)
        temperature_match = re.search(r"(\d+)K", file_name)

        current = float(current_match.group(1)) / 1000 if current_match else None
        temperature = int(temperature_match.group(1)) if temperature_match else None

        if current is None or temperature is None:
            raise Exception("File name is not correct")

        return current, temperature

    def get_experiment_data(self) -> dict:
        experiment_data = {}

        for file_name in self.file_data:
            current, temperature = self._get_measurement_condition(file_name)
            try: 
                dRdT, length = float(self.data["dRdT"]), float(self.data["length"])
            except ValueError:
                raise Exception("dRdT or length is not a number")
            
            start_point = self.data["graphs"][file_name].get("start", None)
            end_point = self.data["graphs"][file_name].get("end", None)

            experiment_data[file_name] = {
                "dRdT": dRdT,
                "length": length,
                "current": current,
                "temperature": temperature,
                "measurement_data": self.file_data[file_name],
                "start_point": start_point,
                "end_point": end_point,
            }

            if start_point is None or end_point is None:
                self.error_points.append(file_name)

        return experiment_data


class ThermalConductivityCalculator:
    def __init__(self, dRdT, length, current, temprature, measurement_data):
        self.dRdT = dRdT
        self.length = length
        self.current = current
        self.temprature = temprature
        self.measurement_data = measurement_data

    def volt_average(self) -> float:
        return np.average([point["Vomega(V)"] for point in self.measurement_data])

    def thermal_conductivity(self, start_point, end_point) -> float:
        # 測定条件の取得
        dRdT = self.dRdT
        length = self.length
        current = self.current
        measurement_data = self.measurement_data
        volt = self.volt_average()
        resistance = volt / current

        # ヒーター周波数の取得
        heater_freq_1 = measurement_data[start_point]["Heater_Freq(Hz)"]
        heater_freq_2 = measurement_data[end_point]["Heater_Freq(Hz)"]

        # 3ω電圧の取得
        v3omega_1 = np.abs(measurement_data[start_point]["V3omega(V)"])
        v3omega_2 = np.abs(measurement_data[end_point]["V3omega(V)"])

        # 傾き
        slope = np.log(heater_freq_2 / heater_freq_1) / (v3omega_1 - v3omega_2)

        # 熱伝導率の計算
        kappa = volt**3 / (4 * np.pi * length * resistance**2) * slope * dRdT

        return kappa

    def thermal_conductivity_imaginary(self, point) -> float:
        # 測定条件の取得
        dRdT = self.dRdT
        length = self.length
        current = self.current
        measurement_data = self.measurement_data
        volt = self.volt_average()

        # 3ω電圧の取得
        Im_v3omega = measurement_data[point]["ImV3omega(V)"]

        # 熱伝導率の計算
        Im_kappa = -(current**2) * volt / (8 * length * Im_v3omega) * dRdT

        return np.abs(Im_kappa)


class ThermalConductivityStats:
    def __init__(self, dRdT, length, current, temprature, measurement_data):
        self.tc_calc = ThermalConductivityCalculator(
            dRdT=dRdT,
            length=length,
            current=current,
            temprature=temprature,
            measurement_data=measurement_data,
        )

    def _calcurate_stats(self, points, func) -> tuple[float, float]:
        """
        与えられた点のリストに対して指定された関数を適用し、その結果の統計値を計算する汎用関数。
        points: 処理する点のリスト。
        func: 各点に適用する関数。
        戻り値: 平均値と標準偏差のタプル。
        """
        values = [func(point) for point in points]
        return np.average(values), np.std(values)

    def slope_points(self, start_point, end_point) -> tuple[list[int], list[int]]:
        """
        与えられた点のリストから、傾きを求めるための点の組み合わせを作成する。
        start_point: 始点のインデックス。
        end_point: 終点のインデックス。
        戻り値: 始点と終点のインデックスのリスト。
        """
        start_points, end_points = [], []
        for start, end in combinations(range(start_point, end_point + 1), 2):
            if start > end:
                start, end = end, start

            if end - start < 3:
                continue

            start_points.append(start)
            end_points.append(end)

        return start_points, end_points

    def average_and_std_of_kappa(self, start_point, end_point) -> tuple[float, float]:
        start_points, end_points = self.slope_points(start_point, end_point)
        return self._calcurate_stats(
            points=zip(start_points, end_points),
            func=lambda pair: self.tc_calc.thermal_conductivity(*pair),
        )

    def average_and_std_of_kappa_imaginary(self, points) -> tuple[float, float]:
        return self._calcurate_stats(
            points=points, func=self.tc_calc.thermal_conductivity_imaginary
        )
