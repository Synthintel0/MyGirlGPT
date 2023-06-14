FROM continuumio/miniconda3
RUN apt update && apt install espeak-ng ffmpeg -y
WORKDIR /root
ADD ./requirements.txt .
RUN pip install -r requirements.txt
ADD ./src .
RUN python -m nltk.downloader punkt
CMD ["python", "main.py"]