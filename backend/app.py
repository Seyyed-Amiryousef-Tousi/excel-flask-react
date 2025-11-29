from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3
import os
import bcrypt
import jwt
import datetime

app = Flask(__name__)
CORS(app)

app.config["SECRET_KEY"] = "your_secret_key_here"  # حتما یه مقدار امن بذار

DB_NAME = "data.db"

# ---------------- Helper: Database Connection ----------------


def db():
    return sqlite3.connect(DB_NAME)


# ---------------- Ensure DB Exists ----------------
conn = db()
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
        if file_ext == ".csv":
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)

        df.columns = [c.strip().lower() for c in df.columns]

        conn = db()
        df.to_sql('products', conn, if_exists='append', index=False)
        conn.close()

        return jsonify({'message': 'File uploaded and data saved to database successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ---------------- View Excel ----------------
@app.route('/excel-data', methods=['GET'])
def get_excel_data():
    conn = db()
    cursor = conn.cursor()

    cursor.execute("PRAGMA table_info(excel_data)")
    columns = [col[1] for col in cursor.fetchall()]

    cursor.execute("SELECT * FROM excel_data")
    rows = cursor.fetchall()
    conn.close()

    data = []
    for row in rows:
        item = {columns[i]: row[i] for i in range(len(columns))}
        data.append(item)

    return jsonify(data)


# ---------------- Delete Excel ----------------
@app.route('/delete-excel', methods=['DELETE'])
def delete_excel_data():
    conn = db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM excel_data")
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
    image = data.get("image")  # Base64 string

    if not name or not desc or not price or not image:
        return jsonify({"error": "All fields are required"}), 400

    conn = db()
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
    conn = db()
    cur = conn.cursor()
    cur.execute("SELECT id, name, desc, price, image FROM products")
    rows = cur.fetchall()
    conn.close()

    data = [{"id": r[0], "name": r[1], "desc": r[2],
             "price": r[3], "image": r[4]} for r in rows]
    return jsonify(data), 200


# ---------------- Delete Product ----------------
@app.route('/delete-product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = db()
    cur = conn.cursor()
    cur.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Product {product_id} deleted successfully"}), 200


# ---------------- Admin Server ----------------
@app.route('/Admin', methods=['GET'])
def Admin():
    data = {
        "message": "Welcome to Admin Panel",
        "users_count": 42,
        "active": True
    }
    return jsonify(data)


# ---------------- Initialize Users Table ----------------
def init_db():
    conn = db()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        nationalCode TEXT NOT NULL,
        birthDate TEXT NOT NULL,
        email TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()


init_db()


# ---------------- Register ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    firstName = data.get("firstName")
    lastName = data.get("lastName")
    phone = data.get("phone")
    nationalCode = data.get("nationalCode")
    birthDate = data.get("birthDate")
    email = data.get("email")
    password = data.get("password")

    if not (firstName and lastName and phone and nationalCode and birthDate and password):
        return jsonify({"error": "Missing fields"}), 400

    conn = db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE phone=?", (phone,))
    if cursor.fetchone():
        return jsonify({"error": "Phone already registered"}), 409

    hashed_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cursor.execute("""
    INSERT INTO users (firstName, lastName, phone, nationalCode, birthDate, email, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (firstName, lastName, phone, nationalCode, birthDate, email, hashed_pass.decode('utf-8')))

    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "User registered successfully"}), 201

# ---------------- Login ----------------
# @app.route("/login", methods=["POST"])
# def login():
#     data = request.json
#     phone = data.get("phone")
#     password = data.get("password")

#     conn = db()
#     cursor = conn.cursor()
#     cursor.execute("SELECT id, password FROM users WHERE phone=?", (phone,))
#     user = cursor.fetchone()

#     if not user:
#         conn.close()
#         return jsonify({"error": "User not found"}), 404

#     stored_password = user[1].encode('utf-8')
#     if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
#         conn.close()
#         return jsonify({"error": "Wrong password"}), 401

#     # ثبت زمان لاگین در ستون last_login
#     import datetime
#     now = datetime.datetime.utcnow().isoformat()
#     cursor.execute("UPDATE users SET last_login=? WHERE id=?", (now, user[0]))

#     # ایجاد رکورد در جدول user_sessions
#     cursor.execute(
#         "INSERT INTO user_sessions (user_id, login_time) VALUES (?, ?)",
#         (user[0], now)
#     )

#     conn.commit()
#     conn.close()

#     token = jwt.encode(
#         {
#             "user_id": user[0],
#             "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
#         },
#         app.config["SECRET_KEY"],
#         algorithm="HS256"
#     )

#     return jsonify({"token": token}), 200


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    phone = data.get("phone")
    password = data.get("password")

    conn = db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, password, role FROM users WHERE phone=?", (phone,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        return jsonify({"error": "User not found"}), 404

    stored_password = user[1].encode('utf-8')
    if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
        conn.close()
        return jsonify({"error": "Wrong password"}), 401

    now = datetime.datetime.utcnow().isoformat()
    cursor.execute("UPDATE users SET last_login=? WHERE id=?", (now, user[0]))
    cursor.execute(
        "INSERT INTO user_sessions (user_id, login_time) VALUES (?, ?)",
        (user[0], now)
    )
    conn.commit()
    conn.close()

    token = jwt.encode(
        {
            "user_id": user[0],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({
        "token": token,
        "role": user[2]  # 🔥 نقش اینجاست
    }), 200


# ---------------- Get All Users ----------------
@app.route("/users", methods=["GET"])
def get_users():
    conn = db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, firstName, lastName, phone, nationalCode, birthDate, email, role FROM users"
    )
    rows = cursor.fetchall()
    conn.close()

    users = [{"id": r[0], "firstName": r[1], "lastName": r[2], "phone": r[3],
              "nationalCode": r[4], "birthDate": r[5], "email": r[6], "role": r[7]} for r in rows]

    return jsonify(users), 200


# ---------------- Get Single User ----------------
@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    conn = db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, firstName, lastName, phone, nationalCode, birthDate, email, role
    FROM users WHERE id=?
    """, (user_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        return jsonify({"error": "User not found"}), 404

    user = {"id": r[0], "firstName": r[1], "lastName": r[2], "phone": r[3],
            "nationalCode": r[4], "birthDate": r[5], "email": r[6], "role": r[7]}

    return jsonify(user), 200


# ---------------- Update User ----------------
@app.route("/edit-user/<int:user_id>", methods=["PUT"])
def edit_user(user_id):
    data = request.json

    conn = db()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE users SET firstName=?, lastName=?, phone=?, nationalCode=?, birthDate=?, email=?, role=?
    WHERE id=?
    """, (
        data["firstName"], data["lastName"], data["phone"], data["nationalCode"],
        data["birthDate"], data["email"], data["role"], user_id
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "User updated"}), 200


# ---------------- Run Server ----------------
if __name__ == '__main__':
    # اضافه کردن مدیر یک‌بار قبل از اجرای سرور
    import sqlite3
    import bcrypt
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()

    # بررسی اینکه مدیر قبلاً وجود ندارد
    cursor.execute("SELECT * FROM users WHERE phone=?", ("+989942082136",))
    if not cursor.fetchone():
        admin_password = "Amiryousef-Tousi"
        hashed = bcrypt.hashpw(admin_password.encode(
            'utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute("""
        INSERT INTO users (firstName, lastName, phone, nationalCode, birthDate, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, ("Seyyed Amiryousef", "Tousi", "+989942082136", "0929319613", "2008-07-22", hashed, "admin"))
        conn.commit()

    conn.close()
    app.run(debug=True)
    app.run(debug=True)
