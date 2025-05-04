from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
CSV_FILE = '../discord bot/questions.csv'

@app.route('/questions')
def get_questions():
    try:
        df = pd.read_csv(CSV_FILE)
        df = df.fillna('')
        df['comment'] = df['comment'].apply(lambda x: x.replace('\n', ' ') if isinstance(x, str) else '') # because comments are optional
        
        return jsonify(df.to_dict(orient='records'))
    except Exception as e:
        print({e})
        return jsonify({"error": str(e)}), 500

@app.route('/test')
def test():
    return jsonify({"message": "API is working!"})

if __name__ == '__main__':
    app.run(debug=True)