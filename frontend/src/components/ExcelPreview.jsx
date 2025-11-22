import { useEffect, useState } from "react";
import axios from "axios";

export default function ExcelPreview() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/excel-preview").then(res => {
      setRows(res.data);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>پریویو اکسل</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            {rows.length > 0 &&
              Object.keys(rows[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {Object.values(r).map((cell, c) => (
                <td key={c}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
