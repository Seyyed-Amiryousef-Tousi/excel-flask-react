

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import AddProduct from "./components/AddProduct";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Signup from "./components/Signup";


export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      
    </Router>
    
  );
}
