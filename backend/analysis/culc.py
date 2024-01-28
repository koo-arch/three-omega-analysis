import re
import numpy as np

class Cuculcation:
    def __init__(self, data, file_data):
        self.dRdT = data["dRdT"]
        self.length = data["length"]
        self.points = data["graphs"]
        self.file_data = file_data
    
    
    def _get_measurement_condition(self, file_name) -> tuple[float, int]:
        current_match = re.search(r'(\d+)mA', file_name)
        temperature_match = re.search(r'(\d+)K', file_name)

        current = float(current_match.group(1)) / 1000 if current_match else None
        temperature = int(temperature_match.group(1)) if temperature_match else None

        if current is None or temperature is None:
            raise Exception("File name is not correct")

        return current, temperature
    
    
    def _conbine_file_data(self):
        conbined_data = {}

        for file_name in self.file_data:
            current, temperature = self._get_measurement_condition(file_name)
    
            conbined_data[file_name] = {
                "current": current,
                "temperature": temperature,
                "measurement_data": self.file_data[file_name],
                "start_point": self.points[file_name]["start"],
                "end_point": self.points[file_name]["end"],
            }

        return conbined_data
    

    def _volt_average(self, measurment_data) -> float:
        return np.average([point["Vomega(V)"] for point in measurment_data])
    
    
    def _thermal_conductivity(self, current, measurement_data, start_point, end_point) -> float:
        # 測定条件の取得
        dRdT = self.dRdT
        length = self.length
        volt = self._volt_average(measurement_data)
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
        kappa = volt ** 3 / (4 * np.pi * length * registance ** 2) * slope * dRdT
        
        return kappa
    
    
    def _thermal_conductivity_imaginary(self, current, measurement_data, point) -> float:
        # 測定条件の取得
        dRdT = self.dRdT
        length = self.length
        volt = self._volt_average(measurement_data)

        # 3ω電圧の取得
        Im_v3omega = np.abs(measurement_data[point]["ImV3omega(V)"])

        # 熱伝導率の計算
        Im_kappa = - current ** 2 * volt / (8 * length * Im_v3omega) * dRdT
        
        return Im_kappa