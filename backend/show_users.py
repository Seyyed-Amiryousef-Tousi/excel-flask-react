import sqlite3

# مسیر دیتابیس
conn = sqlite3.connect("data.db")
cursor = conn.cursor()

# گرفتن همه کاربران
cursor.execute(
    "SELECT id, firstName, lastName, phone, password, nationalCode, birthDate, email, role FROM users"
)
users = cursor.fetchall()

# چاپ کاربران
for u in users:
    print(f"ID: {u[0]}, First name: {u[1]}, Last name: {u[2]}, Phone: {u[3]}, Password: {u[4]}, National code: {u[5]}, Birth date: {u[6]}, Email: {u[7]}, Role: {u[8]}")

conn.close()
