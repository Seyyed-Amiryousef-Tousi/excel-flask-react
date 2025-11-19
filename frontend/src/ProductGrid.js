import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await fetch("http://localhost:5000/products");
    setProducts(await res.json());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm("آیا مطمئن هستید می‌خواهید این محصول حذف شود؟")) {
      try {
        await axios.delete(`http://localhost:5000/delete-product/${id}`);
        loadProducts(); // بارگذاری مجدد محصولات
      } catch (err) {
        alert("خطا در حذف محصول");
      }
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
      }}
    >
      {products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            position: "relative",
          }}
        >
          <img
            src={`data:image/jpeg;base64,${p.image}`}
            alt={p.name}
            style={{ width: "100%", borderRadius: "10px" }}
          />
          <h3>{p.name}</h3>
          <p>{p.desc}</p>
          <strong>{p.price} تومان</strong>
          <DeleteIcon
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
              color: "red",
            }}
            onClick={() => deleteProduct(p.id)}
          />
        </div>
      ))}
    </div>
  );
}
