import re
import numpy as np
from itertools import combinations


class MeasurementFileParser:
    def __init__(self, data, file_data):
        self.data = data
        self.file_data = file_data

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

            experiment_data[file_name] = {
                "dRdT": self.data["dRdT"],
                "length": self.data["length"],
                "current": current,
                "temperature": temperature,
                "measurement_data": self.file_data[file_name],
                "start_point": self.data["graphs"][file_name]["start"],
                "end_point": self.data["graphs"][file_name]["end"],
            }

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
        volt = self.volt_average(measurement_data)
        registance = volt / current

        # ヒーター周波数の取得
        heater_freq_1 = measurement_data[start_point]["Heater_Freq(Hz)"]
        heater_freq_2 = measurement_data[end_point]["Heater_Freq(Hz)"]

        # 3ω電圧の取得
        v3omega_1 = np.abs(measurement_data[start_point]["V3omega(V)"])
        v3omega_2 = np.abs(measurement_data[end_point]["V3omega(V)"])

        # 傾き
        slope = np.log(heater_freq_2 / heater_freq_1) / (v3omega_1 - v3omega_2)

        # 熱伝導率の計算
        kappa = volt**3 / (4 * np.pi * length * registance**2) * slope * dRdT

        return kappa

    def thermal_conductivity_imaginary(self, point) -> float:
        # 測定条件の取得
        dRdT = self.dRdT
        length = self.length
        current = self.current
        measurement_data = self.measurement_data
        volt = self._volt_average(measurement_data)

        # 3ω電圧の取得
        Im_v3omega = np.abs(measurement_data[point]["ImV3omega(V)"])

        # 熱伝導率の計算
        Im_kappa = -(current**2) * volt / (8 * length * Im_v3omega) * dRdT

        return Im_kappa


    def select_point(self, start_point, end_point):
        start_points, end_points = [], []
        for start, end in combinations(range(start_point, end_point + 1), 2):
            if start > end:
                start, end = end, start

            if end - start < 3:
                continue

            start_points.append(start)
            end_points.append(end)

        return start_points, end_points



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

    def average_and_std_of_kappa(self, start_points, end_points) -> tuple[float, float]:
        return self._calcurate_stats(
            points=zip(start_points, end_points),
            func=lambda pair: self.tc_calc.thermal_conductivity(*pair),
        )

    def average_and_std_of_kappa_imaginary(self, points) -> tuple[float, float]:
        return self._calcurate_stats(
            points=points, func=self.tc_calc.thermal_conductivity_imaginary
        )