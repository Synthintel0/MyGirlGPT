#!/bin/bash

cd /MyGirlGPT/opendan-text-generation-webui
nohup python server.py --listen --chat --character Cherry --extensions openai  --model TehVenom_Pygmalion-Vicuna-1.1-7b > textgen.log &