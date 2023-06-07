from pathlib import Path
import json
import ast
from modules.text_generation import encode
import yaml

def build_pygmalion_style_context(data):
    context = ""
    if 'char_persona' in data and data['char_persona'] != '':
        context += f"{data['char_name']}'s Persona: {data['char_persona']}\n"

    if 'world_scenario' in data and data['world_scenario'] != '':
        context += f"Scenario: {data['world_scenario']}\n"

    context = f"{context.strip()}\n<START>\n"
    return context

def replace_character_names(text, name1, name2):
    text = text.replace('{{user}}', name1).replace('{{char}}', name2)
    return text.replace('<USER>', name1).replace('<BOT>', name2)

def replace_openai_names(text, name1, name2):
    return text.replace('\nuser', f"\n{name1}").replace('\nassistant', f"\n{name2}")


def is_bot_in_content(content):
    # text = text.replace('\nuser', name1).replace('{{char}}', name2)
     if '<BOT>' in content:
         True
     else:
         False

 
def get_stopping_strings(state):
    stopping_strings = [f"\n{state['name1']}:", f"\n{state['name2']}:"]
    # stopping_strings += ast.literal_eval(f"[{state['custom_stopping_strings']}]")
    return stopping_strings   

def get_max_prompt_length(state):
    max_length = state['truncation_length'] - state['max_new_tokens']
    return max_length

def replace_all(text, dic):
    for i, j in dic.items():
        text = text.replace(i, j)

    return text


def load_character(character,  mode="cai-chat"):
    context = greeting = turn_template = ""
    greeting_field = 'greeting'
    picture = None
    name1="You"
    name2=""
    # Deleting the profile picture cache, if any
    if Path("cache/pfp_character.png").exists():
        Path("cache/pfp_character.png").unlink()

    if character != 'None':
        folder = 'characters' if not mode == 'instruct' else 'characters/instruction-following'
        for extension in ["yml", "yaml", "json"]:
            filepath = Path(f'{folder}/{character}.{extension}')
            if filepath.exists():
                break

        file_contents = open(filepath, 'r', encoding='utf-8').read()
        data = json.loads(file_contents) if extension == "json" else yaml.safe_load(file_contents)

        # Finding the bot's name
        for k in ['name', 'bot', '<|bot|>', 'char_name']:
            if k in data and data[k] != '':
                name2 = data[k]
                break

        # Find the user name (if any)
        for k in ['your_name', 'user', '<|user|>']:
            if k in data and data[k] != '':
                name1 = data[k]
                break

        for field in ['context', 'greeting', 'example_dialogue', 'char_persona', 'char_greeting', 'world_scenario']:
            if field in data:
                data[field] = replace_character_names(data[field], name1, name2)

        if 'context' in data:
            context = data['context']
            if mode != 'instruct':
                context = context.strip() + '\n\n'
        elif "char_persona" in data:
            context = build_pygmalion_style_context(data)
            greeting_field = 'char_greeting'

        if 'example_dialogue' in data:
            context += f"{data['example_dialogue'].strip()}\n"

        if greeting_field in data:
            greeting = data[greeting_field]

        if 'turn_template' in data:
            turn_template = data['turn_template']

    return name1, name2, greeting, context

