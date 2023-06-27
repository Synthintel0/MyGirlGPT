### Manual installation using Conda

Recommended if you have some experience with the command-line.

On Windows, I additionally recommend carrying out the installation on WSL instead of the base system: [WSL installation guide](https://github.com/oobabooga/text-generation-webui/blob/main/docs/WSL-installation-guide.md).

#### 0. Install Conda

https://docs.conda.io/en/latest/miniconda.html

On Linux or WSL, it can be automatically installed with these two commands:

```
curl -sL "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh" > "Miniconda3.sh"
bash Miniconda3.sh
```
Source: https://educe-ubc.github.io/conda.html

#### 0.1 (Ubuntu/WSL) Install build tools

```
sudo apt install build-essential
```


#### 1. Create a new conda environment

```
conda create -n textgen python=3.10.9
conda activate textgen
```

#### 2. Install Pytorch

| System | GPU | Command |
|--------|---------|---------|
| Linux/WSL | NVIDIA | `pip3 install torch torchvision torchaudio` |
| Linux | AMD | `pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.4.2` |
| MacOS + MPS (untested) | Any | `pip3 install torch torchvision torchaudio` |

The up to date commands can be found here: https://pytorch.org/get-started/locally/. 

#### 2.1 Special instructions

* MacOS users: https://github.com/oobabooga/text-generation-webui/pull/393
* AMD users: https://rentry.org/eq3hg

#### 3. Install the web UI

```
git clone https://github.com/Synthintel0/MyGirlGPT
cd MyGirlGPT/opendan-text-generation-webui
pip install -r requirements.txt
```
#### 4. Download model
```
python download-model.py TehVenom/Pygmalion-Vicuna-1.1-7b
```

#### 5. Install openai extensions
```
pip install -r extensions/openai/requirements.txt
```
#### 6. Set env in `.env` file
```
cp .env_template .env
```
Edit following env in the `.env` file
```
OPENAI_API_KEY='YOUR OPENAI API KEY'
SD_ADDRESS='SD WEBUI API ADDRESS'
```
#### 7. Run Server
```
python server.py --listen --chat --character Cherry --extensions openai  --model TehVenom_Pygmalion-Vicuna-1.1-7b 
```
Now `GTP_SERVER` used in `TelegramBot` is available on the port 5001.

If you want to change server port, just set `OPENEDAI_PORT` in the `.env` file.