# Telegram Bot for MyGirlGPT
# Installation

## Cloning this repo
```cmd
git clone https://github.com/Synthintel0/MyGirlGPT
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
# alternative. If you want to save chat message for a long time, even if mygirl restarts, it will not be lost. You can achieve this by setting the redis address
REDIS_SERVER="ADDRESS OF REDIS"
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
4. REDIS_SERVER
```
## Docker Local Setup
```cmd
docker-compose  -f docker-compose.yml up -d --remove-orphans
```

## Docker Image
If you do not want to build docker images, you can use images on the dockerhub
- docker pull synthintel2/bot:latest
- docker pull synthintel2/mygirl:latest
