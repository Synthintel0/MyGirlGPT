#!/bin/bash

cd /MyGirlGPT/TelegramBot
nohup npm run start:bot > bot.log &
nohup npm run start:mygirl > mygirl.log &