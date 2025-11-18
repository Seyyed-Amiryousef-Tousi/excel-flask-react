from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3
import os

app = Flask(__name__)
CORS(app)  

DB_NAME = 'data.db'

# Ensure database exists
if not os.path.exists(DB_NAME):
    conn = sqlite3.connect(DB_NAME)
    conn.close()


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not file.filename.endswith('.xlsx'):
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        # خواندن فایل اکسل
        df = pd.read_excel(file)

        # تبدیل نام ستون‌ها به حروف کوچک برای جلوگیری از ناسازگاری
        df.columns = [c.strip().lower() for c in df.columns]

        # اتصال به SQLite و ذخیره داده‌ها
        conn = sqlite3.connect(DB_NAME)

        # اگر جدول وجود نداشت، خودش ساخته میشه
        df.to_sql('excel_data', conn, if_exists='append', index=False)
        conn.close()

        return jsonify({'message': 'File uploaded and data saved to database successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
