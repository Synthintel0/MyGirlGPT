import base64
import io
import time
from pathlib import Path
import requests
import json
from PIL import Image
import os
import random

sd_address = "YOUR_SD_ADDRESS"

# parameters which can be customized in settings.json of webui
params = {
    'address': sd_address,
    'SD_model': 'bra_v5',  # not used right now
    'prompt_prefix': '(8k, best quality, masterpiece:1.2), (realistic, photo-realistic:1.37), ultra-detailed, ultra high res, 1 girl',
    'negative_prompt': 'paintings,sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, (monochrome), (grayscale),(bad-hands-5:0.8),(negative_hand-neg:0.8),easynegative, ng_deepnegative_v1_75t,((belly wrinkles,abs,navel piercing,nail polish,mole)),(bad-artist, bad-image-v2-39000)',
    'width': 640,
    'height': 640,
    'restore_faces': False,
    'enable_hr': True,
    'hr_upscaler': 'R-ESRGAN 4x+ Anime6B',
    'hr_scale': '2',
    'denoising_strength': 0.5,
    'seed': -1,
    'sampler_name': 'DPM++ SDE Karras',
    'steps': 20,
    'cfg_scale': 7
}


# Get and save the Stable Diffusion-generated picture
def get_sd_pictures(description):
    global params, initial_string
    payload = {
        "prompt": params['prompt_prefix'] + "," + description,
        "seed": -1,
        "sampler_name": params['sampler_name'],
        "enable_hr": params['enable_hr'],
        "hr_scale": params['hr_scale'],
        "hr_upscaler": params['hr_upscaler'],
        "denoising_strength": params['denoising_strength'],
        "steps": params['steps'],
        "cfg_scale": params['cfg_scale'],
        "width": params['width'],
        "height": params['height'],
        "restore_faces": params['restore_faces'],
        "override_settings": {
           "sd_model_checkpoint": params['SD_model'],
        },
        "override_settings_restore_afterwards": True,
        "negative_prompt": params['negative_prompt']
    }
    print(f'prompt: {payload["prompt"]}')

    num_retries = 3
    for attempt in range(num_retries):
        try:
            response = requests.post(url=f'{params["address"]}/sdapi/v1/txt2img', json=payload)
            response.raise_for_status()
            r = response.json()
            break
        except Exception as e:
            print(f"Get exception during generation pic: {e}")
            if attempt == num_retries - 1:
                return ""
        time.sleep(1)
    
    visible_result = ""
    if len(r.get('images')) > 0:
        img_str = r.get('images')[0]
        variadic = f'{int(time.time())}'
        output_file = Path(f'{variadic}.png')
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file.as_posix(), 'wb') as f:
            img_data = base64.b64decode(img_str)
            f.write(img_data)
            visible_result = img_str
    return visible_result


if __name__ == '__main__':
    get_sd_pictures("wearing accessories, standing against a wall, natural lighting")
