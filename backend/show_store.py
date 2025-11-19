import sqlite3

DB_NAME = "data.db"

conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

# اگر جدول products وجود داشت، اطلاعات را بگیرد
cursor.execute("PRAGMA table_info(products);")
columns_info = cursor.fetchall()

if not columns_info:
    print("❌ Table 'products' does NOT exist in the database.")
    conn.close()
    exit()

# گرفتن نام ستون‌ها
columns = [col[1] for col in columns_info]

# گرفتن همه رکوردها
cursor.execute("SELECT * FROM products")
rows = cursor.fetchall()

print("\n=== Products Table ===\n")
print("\t".join(columns))
print("-" * 80)

for row in rows:
    formatted = []
    for item in row:
        if item is None:
            formatted.append("-")
        elif isinstance(item, bytes):
            formatted.append("<BINARY DATA>")
        elif len(str(item)) > 100:
            formatted.append(str(item)[:100] + "...")
        else:
            formatted.append(str(item))
    print("\t".join(formatted))

conn.close()
