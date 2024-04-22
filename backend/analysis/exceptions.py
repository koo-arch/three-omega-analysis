from rest_framework.exceptions import APIException

class AnalysisException(APIException):
    status_code = 400
    default_detail = '解析中にエラーが発生しました。'
    default_code = 'analysis_error'