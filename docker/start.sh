#!/bin/bash

if [[ $PUBLIC_KEY ]]
then
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    cd ~/.ssh
    echo $PUBLIC_KEY >> authorized_keys
    chmod 700 -R ~/.ssh
    cd /
    service ssh start
fi

if [[ $JUPYTER_PASSWORD ]]
then
  echo "Launching Jupyter Lab"
  cd /
  nohup jupyter lab --allow-root --no-browser --port=8888 --ip=* --ServerApp.token=$JUPYTER_PASSWORD --ServerApp.allow_origin=* --ServerApp.preferred_dir=/workspace &
fi

cd /MyGirlGPT/

if [ ! -z "$LOAD_MODEL" ] && [ "$LOAD_MODEL" != "TehVenom/Pygmalion-Vicuna-1.1-7b" ]; then
    rm -rf /MyGirlGPT/models/TehVenom_Pygmalion-Vicuna-1.1-7b
    python /MyGirlGPT/download-model.py $LOAD_MODEL
fi

if [[ $OPENAI_API_KEY ]]
then
   echo "OPENAI_API_KEY=${OPENAI_API_KEY}" >> /MyGirlGPT/opendan-text-generation-webui/.env
fi


if [[ $SD_ADDRESS ]]
then
  echo "SD_ADDRESS=${SD_ADDRESS}" >> /MyGirlGPT/opendan-text-generation-webui/.env
fi

if [[ $BOT_TOKEN ]]
then
    sed -i "s/BOT_TOKEN='YOUR BOT TOKEN'/BOT_TOKEN='$BOT_TOKEN'/" /MyGirlGPT/TelegramBot/.env
fi

echo "Launching Server"
#python server.py --listen # runs Oobabooga text generation webui on port 7860
/usr/bin/redis-server /etc/redis/redis.conf

/MyGirlGPT/start_opendan_textgen_server.sh 

/MyGirlGPT/start_opendan_tts_server.sh

/MyGirlGPT/start_telegram_bot.sh

sleep infinity