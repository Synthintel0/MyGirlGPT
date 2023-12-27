# MyGirlGPT - Your Personal AI Girlfriend Running on Your Personal Server
[![GitHub Repo stars](https://img.shields.io/github/stars/Synthintel0/MyGirlGPT?style=social)](https://github.com/Synthintel0/MyGirlGPT/stargazers)
[![Twitter Follow](https://img.shields.io/twitter/follow/SynthIntel2023?style=social)](https://twitter.com/SynthIntel2023)
[![Twitter Follow](https://img.shields.io/twitter/follow/MyGirlGPT?style=social)](https://twitter.com/MyGirlGPT)

Welcome to the MyGirlGPT repository. This project allows you to build your personalized AI girlfriend with a unique personality, voice, and even selfies. The AI girlfriend runs on your personal server, giving you complete control and privacy.

MyGirlGPT is AI agent deploy on the [OpenDAN-Personal-AI-OS](https://github.com/fiatrete/OpenDAN-Personal-AI-OS)

## Demo
Click the image below to watch a demo:

[![Demo Video](http://img.youtube.com/vi/GlDwTl__UDs/0.jpg)](https://www.youtube.com/watch?v=GlDwTl__UDs "Demo Video")


## Architecture

<details>
  <summary>The Architecture of Project </summary>

![Architecture](imgs/architecture.png)

- TelegramBot
  - bot: Receive messages from Telegram, and send messages to mygirl.
  - mygirl: Process the message and send it to the LLM Server. If text-to-speech conversion is required, call the TTS Server.
- LLM Server: As the brain of the AI girlfriend, generates reply messages. If it is determined that a message is required by the user, call the stable diffusion webui API to generate an image.
- TTS Server: Provide text-to-speech capabilities.
- text2img Server: Use stable diffusion webui API to provide text2img capabilities.
</details>

## How to run on your personal server
1. Start the Stable Diffusion Webui  
   Start with the `--api` argument. If you're deploying the service across multiple devices, you'll also need to add the `--listen` argument. 
   The SD Webui will now be listening on port `7860`.  
   You'll have your configuration: `SD_ADDRESS='http://stablediffusion:7860'`, this will be used in the next step.
2. Start the LLM Server  
   Follow the instructions outlined in the [How to run LLM Server](docs/LLM.md). Once the server is running.The LLM Server will be running on port `5001`.   
3. Start the TTS Server  
   Follow the instructions outlined in the [How to run TTS Server](opendan-tts-server/README.md). Once the server is running, it will be listening on port `6006`.
4. Start the TelegramBot  
   You should now have the `GPT_SERVER=http://LLM-SERVER:5001` and `TTS_SERVER=http://TTS-SREVER:6006`.  
   Follow the instructions outlined in the [How to run TelegramBot](TelegramBot/README.md) to start the bot.  
Now you can have fun chatting with your AI girl!!!


## [How to Run MyGirlGPT in RunPod](docker/README.md)

https://github.com/Synthintel0/MyGirlGPT/assets/135929884/0484065f-e956-4ace-a8cd-315fadd67156

### What's RunPod
> [RunPod](https://www.runpod.io) is a cloud computing platform, primarily designed for AI and machine learning applications. 

## Features
* Telegram Integration: Connect directly with your AI girlfriend through Telegram, allowing you to send and receive messages seamlessly.
* Local Large Language Model (LLM): Powered by [text-generation-webui](https://github.com/oobabooga/text-generation-webui) with better privacy protection.
* Personality Customization: Tailor the AI's personality to your preferences, making her a perfect match for you.
The model is [TehVenom/Pygmalion-Vicuna-1.1-7b](https://huggingface.co/TehVenom/Pygmalion-Vicuna-1.1-7b)
* Voice Generation: Utilize [Bark](https://github.com/suno-ai/bark) to generate a voice for your AI model, enhancing the immersive experience.
* Selfie Generation: Your AI girlfriend is capable of generating photorealistic selfies upon request, powered by [Stable Diffusion web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui).

## Roadmap
* Long-Term Memory: Enable MyGirlGPT to "remember" conversations long-term, which will enhance the depth and continuity of your interactions.
* Video Messages: Your AI girlfriend will be able to send you videos of herself, providing a more immersive and engaging experience.
* Discord Bot: Connect your AI girlfriend to Discord, expanding the platforms where you can interact with her.
* LLM for SD prompts: Replacing GPT-3.5 with a local LLM to generate prompts for SD.
* Switch Personality: Allow users to switch between different personalities for AI girlfriend, providing more variety and customization options for the user experience.


## [FAQ](docs/FAQ.md)

## Contributing
We welcome pull requests. If you plan to make significant changes, please open an issue first to discuss them.




## **⭐Star History**

[![Star History Chart](https://api.star-history.com/svg?repos=Synthintel0/MyGirlGPT&type=Date)](https://api.star-history.com/svg?repos=Synthintel0/MyGirlGPT&type=Date)

## License
This project is licensed under the MIT License.

## Powered by
- [Stable Diffusion web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [Bark](https://github.com/suno-ai/bark)
- [text-generation-webui](https://github.com/oobabooga/text-generation-webui)
- [TehVenom/Pygmalion-Vicuna-1.1-7b](https://huggingface.co/TehVenom/Pygmalion-Vicuna-1.1-7b)
