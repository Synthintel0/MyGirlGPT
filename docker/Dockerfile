# start from runpod pytorch container
ARG BASE_IMAGE=runpod/pytorch:3.10-2.0.0-117

FROM ${BASE_IMAGE} as dev-base

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV DEBIAN_FRONTEND noninteractive\

SHELL=/bin/bash

RUN apt-key del 7fa2af80
RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/3bf863cc.pub
RUN apt-get update --yes && \
    # - apt-get upgrade is run to patch known vulnerabilities in apt-get packages as
    #   the ubuntu base image is rebuilt too seldom sometimes (less than once a month)
    apt-get upgrade --yes && \
    apt install --yes --no-install-recommends\
    wget\
    bash\
    espeak-ng\
    ffmpeg\
    openssh-server &&\
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen
RUN /usr/bin/python3 -m pip install --upgrade pip
RUN pip install jupyterlab
RUN pip install ipywidgets

#install opendan-text-generation-webui
RUN git clone https://github.com/Synthintel0/MyGirlGPT.git &&\
    cd /MyGirlGPT/opendan-text-generation-webui &&\
    pip install -r requirements.txt &&\
    pip install -r extensions/openai/requirements.txt 
#install opendan-tts-server
RUN cd /MyGirlGPT/opendan-tts-server &&\
    pip install -r requirements.txt 

#install TelegramBot
RUN apt install -y npm && \
    npm install n -g &&\
    n stable &&\
    hash -r &&\
    cd /MyGirlGPT/TelegramBot &&\
    npm install

WORKDIR /MyGirlGPT

RUN cd opendan-text-generation-webui && python download-model.py TehVenom/Pygmalion-Vicuna-1.1-7b
ADD install_bark.py .
RUN python install_bark.py
RUN python -m nltk.downloader punkt
RUN apt install -y redis

ADD start_opendan_textgen_server.sh /MyGirlGPT/
ADD start_opendan_tts_server.sh /MyGirlGPT/
ADD start_telegram_bot.sh /MyGirlGPT/

RUN chmod +x /MyGirlGPT/start_opendan_textgen_server.sh
RUN chmod +x /MyGirlGPT/start_opendan_tts_server.sh
RUN chmod +x /MyGirlGPT/start_telegram_bot.sh
ADD start.sh /
RUN chmod +x /start.sh

CMD [ "/start.sh" ]