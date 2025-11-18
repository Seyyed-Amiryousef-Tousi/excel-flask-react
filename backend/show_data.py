import sqlite3

conn = sqlite3.connect("data.db")
cursor = conn.cursor()

# گرفتن نام ستون‌ها
cursor.execute("PRAGMA table_info(excel_data);")
columns = [info[1] for info in cursor.fetchall()]

# گرفتن همه داده‌ها
cursor.execute("SELECT * FROM excel_data")
rows = cursor.fetchall()

# چاپ جدول خوانا
print("=== Contents of excel_data ===\n")
print("\t".join(columns))
print("-" * 80)
for row in rows:
    print("\t".join([str(item) if item is not None else "-" for item in row]))

conn.close()
