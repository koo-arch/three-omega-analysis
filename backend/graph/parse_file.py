import os
from django.utils.html import escape
from .sanitize import Sanitize

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

    def set_errors(self, error_response, error_dict) -> None:
        for name, errors in error_dict.items():
            if name not in error_response:
                error_response[name] = []
            error_response[name].extend(errors)

    def parse_errors(self) -> dict:
        if self.value_errors or self.column_errors:
            error_response = {}
            self.set_errors(error_response, self.column_errors)
            self.set_errors(error_response, self.value_errors)

            return error_response

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
            sanitized_file_name = Sanitize.sanitize_filename(file.name)

            start_processing = False
            measurement_data = []

            for index, line in enumerate(lines, 1):

                # Columns>> からデータ処理を開始する
                if line.startswith("Columns>>"):
                    columns = line.split("Columns>> ")[1].strip().split()
                    columns_name = [escape(column) for column in columns]

                    if not self.validate_columns(columns_name):
                        self.add_error(column_errors, sanitized_file_name, "Columns>> で指定された列名が不正です。")
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
                self.add_error(column_errors, sanitized_file_name, "Columns>> が見つかりません。")

            graph_name = os.path.splitext(sanitized_file_name)[0]
            file_data[graph_name] = measurement_data

        return file_data
