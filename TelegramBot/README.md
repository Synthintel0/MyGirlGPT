# Telegram Bot for MyGirlGPT
# Installation

## Cloning this repo
```cmd
git clone https://github.com/Synthintel/MyGirlGPT
cd MyGirlGPT/TelegramBot
```

## Install the package

```cmd
npm install
```
## Edit .env file
### For bot
Get bot token at [`@BotFather`](http://t.me/BotFather).
```cmd
BOT_TOKEN="YOUR BOT TOKEN"
WEBSOCKET_PORT=8081
START_COMMAND_REPLY_TEXT='./src/assets/hello.txt' # file path
START_COMMAND_REPLY_VOICE='./src/assets/hello.oga' # file path
START_COMMAND_REPLY_PHOTO='./src/assets/hello.jpg' # file path
```
### For mygirl
```
WEBSOCKET_SERVER="ADDRESS OF BOT"
GPT_SERVER="OPENAI API ADDRESS OF TEXT-GENERATION-WEBUI"
TTS_SERVER="ADDRESS FOR TTS"
CONVERSATION_COUNT_THRESHOLD=100 # Maximum number of historical conversations that will be sent to GPT
```

## Run the bot & mygirl

```cmd
npm run start:bot
npm run start:mygirl
```
# How To Run Locally in docker
## Edit docker-compose.yaml
Following Env need to be set.
```
1. BOT_TOKEN
2. GPT_SERVER
3. TTS_SERVER
```
## Docker Local Setup
```cmd
docker-compose  -f docker-compose.yml up -d --remove-orphans
```

## Docker Image
If you do not want to build docker images, you can use images on the dockerhub
- docker pull synthintel2/bot:latest
- docker pull synthintel2/mygirl:latest
