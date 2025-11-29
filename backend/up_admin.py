import sqlite3
import bcrypt

# رمز جدیدی که میخوای بگذاری
new_password = "phd.1387"  # 🔹 اینجا رمز جدیدت رو بزار

# هش کردن رمز
hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# اتصال به دیتابیس
conn = sqlite3.connect("data.db")
cur = conn.cursor()

# بروزرسانی رمز برای کاربری با ID = 2   
cur.execute("UPDATE users SET password=? WHERE id=?", (hashed, 2))

conn.commit()
conn.close()

print("رمز عبور با موفقیت تغییر کرد!")
