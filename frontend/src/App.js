

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import AddProduct from "./components/AddProduct";
import Admin from "./components/Admin";
// import ExcelUpload from "./components/ExcelUpload";
// import ExcelPreview from "./components/ExcelPreview";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/Admin" element={<Admin />} />
        {/* <Route path="/excel-upload" element={<ExcelUpload />} />
        <Route path="/excel-preview" element={<ExcelPreview />} /> */}
      </Routes>
    </Router>
  );
}

