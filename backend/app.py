from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_NAME = "data.db"

# ---------------- Ensure DB Exists ----------------
conn = sqlite3.connect(DB_NAME)
cur = conn.cursor()

# ایجاد جدول اکسل اگر وجود ندارد
cur.execute("""
CREATE TABLE IF NOT EXISTS excel_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT
)
""")

# ایجاد جدول محصولات
cur.execute("""
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    desc TEXT,
    price REAL,
    image TEXT
)
""")

conn.commit()
conn.close()


# ---------------- Home ----------------
@app.route('/')
def home():
    return "Backend is running..."


# ---------------- Upload Excel ----------------
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # همه پسوندهای اکسل و CSV
    ALLOWED_EXTENSIONS = (".xls", ".xlsx", ".xlsm", ".csv")
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        # CSV یا اکسل
        if file_ext == ".csv":
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)

        df.columns = [c.strip().lower() for c in df.columns]

        conn = sqlite3.connect(DB_NAME)
        df.to_sql('excel_data', conn, if_exists='append', index=False)
        conn.close()

        return jsonify({'message': 'File uploaded and data saved to database successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------------- View Excel ----------------


@app.route('/excel-data', methods=['GET'])
def get_excel_data():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("PRAGMA table_info(excel_data)")
    columns = [col[1] for col in cursor.fetchall()]

    cursor.execute("SELECT * FROM excel_data")
    rows = cursor.fetchall()
    conn.close()

    # تبدیل هر ردیف به دیکشنری
    data = []
    for row in rows:
        item = {}
        for i, col in enumerate(columns):
            item[col] = row[i]
        data.append(item)

    return jsonify(data)

#  ---------------- Delete Excel ----------------


@app.route('/delete-excel', methods=['DELETE'])
def delete_excel_data():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM excel_data")  # پاک کردن همه داده‌ها
    conn.commit()
    conn.close()
    return jsonify({'message': 'Excel data cleared successfully'})


# ---------------- Add Product (Base64 Image) ----------------
@app.route('/add-product', methods=['POST'])
def add_product():
    data = request.get_json()

    name = data.get("name")
    desc = data.get("desc")
    price = data.get("price")
    image = data.get("image")   # Base64 string

    if not name or not desc or not price or not image:
        return jsonify({"error": "All fields are required"}), 400

    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO products (name, desc, price, image) VALUES (?, ?, ?, ?)",
        (name, desc, price, image)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Product added successfully"}), 200


# ---------------- Get All Products ----------------
@app.route('/products', methods=['GET'])
def get_products():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()

    cur.execute("SELECT id, name, desc, price, image FROM products")
    rows = cur.fetchall()
    conn.close()

    data = []
    for r in rows:
        data.append({
            "id": r[0],
            "name": r[1],
            "desc": r[2],
            "price": r[3],
            "image": r[4]
        })

    return jsonify(data), 200


# ---------------- Delete Product ----------------
@app.route('/delete-product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    
    cur.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    
    return jsonify({"message": f"Product {product_id} deleted successfully"}), 200



# ---------------- Run Server ----------------
if __name__ == '__main__':
    app.run(debug=True)
