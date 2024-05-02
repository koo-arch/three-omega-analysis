import re

class Sanitize:
    @staticmethod
    def sanitize_filename(filename):
        """
        ディレクトリトラバーサル対策のため、ファイル名に含まれる特殊文字を削除する
        """
        filename = re.sub(r'[<>:"/\\|?*]',"", filename)  # 特殊文字を一括置換
        filename = re.sub(r"\.\.+", "", filename)  # 連続するドットは単一のドットに置換
        filename = filename[:255]  # ファイル名長の制限

        return filename
