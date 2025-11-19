import React, { useState, useEffect } from "react";

export default function ExcelTable({ refresh }) {
  const [rows, setRows] = useState([]);

  const loadData = async () => {
    const res = await fetch("http://localhost:5000/excel-data");
    const data = await res.json();
    setRows(data);
  };

  useEffect(() => {
    loadData();
  }, [refresh]);

  if (rows.length === 0) return <p>هیچ داده‌ای وجود ندارد.</p>;

  const columns = Object.keys(rows[0]);

  return (
    <table
      border="1"
      cellPadding="8"
      style={{
        width: "100%",
        marginTop: "20px",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} style={{ background: "#eee" }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col}>
                {row[col] === null || row[col] === "" ? "-" : row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
