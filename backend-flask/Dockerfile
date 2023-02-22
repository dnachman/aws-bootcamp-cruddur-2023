FROM python:3.10-slim-buster
WORKDIR /backend-flask

# copy from working dir to image
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# copy rest of files
COPY . .

ENV FLASK_ENV=development

EXPOSE ${PORT}

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=4567"]
