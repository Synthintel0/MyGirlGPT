### Manual installation using Conda

#### 1. Create a new conda environment

```
conda create -n tts python=3.10.10
conda activate tts
```

#### 2. Install requirements

```
pip install -r requirements.txt
```

#### 3. Download nltk
```
python -m nltk.downloader punkt
```

#### 4. Run Server
```
cd src
python main.py
```