import os

class ParseTextFile:
    def __init__(self, files: list, registered_data: dict):
        self.files = files
        self.registered_data = registered_data
        self.value_errors = {}
        self.column_errors = {}
        self.default_columns_name = [
            "Current_Freq(Hz)",
            "Heater_Freq(Hz)",
            "Vomega(V)",
            "ImVomega(V)",
            "V3omega(V)",
            "ImV3omega(V)",
        ]


    def add_error(self, error_dict, file_name, message) -> None:
        if file_name not in error_dict:
            error_dict[file_name] = []
        error_dict[file_name].append(message)


    def process_measurement_data(self, values, columns_name, index, file) -> None:
        for i, column in enumerate(columns_name):
            try:
                values[i] = float(values[i])
            except ValueError:
                self.add_error(self.value_errors, file.name, f"{index}行目の{column}が数値ではありません。")
                values[i] = None


    def validate_columns(self, columns_name: list) -> bool:
        return columns_name == self.default_columns_name


    def parse_text_file(self) -> dict:
        file_data = self.registered_data
        files = self.files
        column_errors = self.column_errors

        for file in files:
            lines = file.read().decode("utf-8").splitlines()

            start_processing = False
            measurement_data = []
            columns_name = []

            for index, line in enumerate(lines, 1):

                # Coulmns>> からデータ処理を開始する
                if line.startswith("Columns>>"):
                    columns = line.split("Columns>> ")[1].strip().split()
                    for column in columns:
                        columns_name.append(column)

                    if not self.validate_columns(columns_name):
                        self.add_error(column_errors, file.name, "Columns>> で指定された列名が不正です。")
                        break

                    start_processing = True

                # データ処理開始後の行を処理
                elif start_processing:
                    values = line.strip().split()
                    # 測定データを列ごとに分割してmeasurement_dataに追加
                    if len(values) > 1:
                        self.process_measurement_data(values, columns_name, index, file)
                        measurement_data.append(dict(zip(columns_name, values)))

            if not start_processing and not column_errors:
                self.add_error(column_errors, file.name, "Columns>> が見つかりません。")

            file_name = os.path.splitext(file.name)[0]
            file_data[file_name] = measurement_data

        return file_data