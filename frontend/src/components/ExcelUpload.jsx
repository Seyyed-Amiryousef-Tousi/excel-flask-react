import { useState } from "react";
import axios from "axios";

export default function ExcelUpload() {
  const [file, setFile] = useState();

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadExcel = async () => {
    const formData = new FormData();
    formData.append("excel", file);

    await axios.post("http://127.0.0.1:5000/upload", formData
, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("فایل آپلود شد");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>آپلود اکسل</h2>
      <input type="file" accept=".xlsx" onChange={handleFile} />
      <br /><br />
      <button onClick={uploadExcel}>آپلود</button>
    </div>
  );
}
