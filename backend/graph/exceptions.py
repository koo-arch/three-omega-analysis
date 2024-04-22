from rest_framework.exceptions import APIException

class FileProcessingException(APIException):
    status_code = 400
    default_detail = 'ファイル処理中にエラーが発生しました。'
    default_code = 'file_processing_error'