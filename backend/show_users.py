import sqlite3

# مسیر دیتابیس
conn = sqlite3.connect("data.db")
cursor = conn.cursor()

# گرفتن همه کاربران
cursor.execute("SELECT id, firstName, lastName, phone, nationalCode, birthDate, email, role FROM users")
users = cursor.fetchall()

# چاپ کاربران
for u in users:
    print(f"ID: {u[0]}, name: {u[1]}, last name: {u[2]}, phone: {u[3]}, national code: {u[4]}, date: {u[5]}, E-mail: {u[6]}, role: {u[7]}")

conn.close()
