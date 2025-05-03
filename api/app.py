from flask import Flask, jsonify
import pandas as pd

#app = Flask(__name__)
CSV_FILE = '../discord bot/questions.csv'
def get_questions():
    df = pd.read_csv(CSV_FILE)
    df.fillna('')
    df['comment'] = df['comment'].apply(lambda x: x.replace('\n', ' ') if isinstance(x, str) else '') # required to fix questions without comments
    return df

print(get_questions().to_string())