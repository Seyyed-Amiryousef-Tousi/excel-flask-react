import React, { useEffect, useState } from "react";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await fetch("http://localhost:5000/products");
    setProducts(await res.json());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            background: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
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
        </div>
      ))}
    </div>
  );
}
