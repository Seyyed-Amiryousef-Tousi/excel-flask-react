// App.jsx
import React, { useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import ProductGrid from "./ProductGrid";
import ExcelTable from "./ExcelTable";

function App() {
  // ---------------- Excel Upload ----------------
  const [excelFile, setExcelFile] = useState(null);
  const [excelMessage, setExcelMessage] = useState("");
  const [refreshExcel, setRefreshExcel] = useState(false); // برای رفرش جدول بعد از آپلود یا پاک کردن

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const uploadExcel = async (e) => {
    e.preventDefault();
    if (!excelFile) return setExcelMessage("Please select a file");

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setExcelMessage(res.data.message);
      setRefreshExcel(!refreshExcel); // بعد از آپلود جدول رفرش شود
    } catch (err) {
      setExcelMessage("Upload failed");
    }
  };

  // ---------------- Add Product ----------------
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [fileB64, setFileB64] = useState("");
  const [addMessage, setAddMessage] = useState("");

  const handleImage = (e) => {
    const img = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setFileB64(base64);
    };
    reader.readAsDataURL(img);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!name || !desc || !price || !fileB64)
      return setAddMessage("همه فیلدها لازم است");

    try {
      await axios.post("http://localhost:5000/add-product", {
        name,
        desc,
        price,
        image: fileB64,
      });
      setAddMessage("Product added!");
    } catch (err) {
      setAddMessage("Error adding product");
    }
  };

  // ---------------- Delete Excel ----------------
  const deleteExcel = async () => {
    if (window.confirm("آیا مطمئن هستید می‌خواهید داده‌های اکسل پاک شوند؟")) {
      try {
        await axios.delete("http://localhost:5000/delete-excel");
        setExcelMessage("Excel data cleared!");
        setRefreshExcel(!refreshExcel); // جدول رفرش شود
      } catch (err) {
        setExcelMessage("Error clearing excel data");
      }
    }
  };

  return (
    <div style={{ padding: 20, direction: "rtl", fontFamily: "sans-serif" }}>
      {/* ================= Excel Upload Section ================= */}
      <h2>Upload Excel File</h2>
      <form onSubmit={uploadExcel}>
        <input type="file" accept=".xls,.xlsx,.xlsm,.csv" onChange={handleExcelChange} />
        <button type="submit">Upload</button>
      </form>
      {excelMessage && <p>{excelMessage}</p>}

      <hr style={{ margin: "30px 0" }} />

      {/* ================= Excel Table with Delete ================= */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h3>Excel Data</h3>
        <DeleteIcon
          style={{ cursor: "pointer", color: "red" }}
          onClick={deleteExcel}
        />
      </div>
      <ExcelTable refresh={refreshExcel} />

      <hr style={{ margin: "30px 0" }} />

      {/* ================= Add Product Section ================= */}
      <h2>Add Product</h2>
      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Description"
          onChange={(e) => setDesc(e.target.value)}
        />
        <br />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
        />
        <br />
        <input type="file" accept="image/*" onChange={handleImage} />
        <br />
        <button type="submit">Add Product</button>
      </form>
      {addMessage && <p>{addMessage}</p>}

      <hr style={{ margin: "30px 0" }} />

      {/* ================= Products Grid ================= */}
      <h2>Products</h2>
      <ProductGrid />
    </div>
  );
}

export default App;
