FROM python:3.11.3-alpine

RUN apk update \
    && apk add --no-cache build-base \
    && apk add --no-cache libffi-dev


WORKDIR /backend
COPY ./backend /backend

# ENV PATH=/opt/homebrew/anaconda3/bin:$PATH
RUN pip install --no-cache-dir -q -r requirements.txt


CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]