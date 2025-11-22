import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";

const drawerWidth = 240;

// ================= Products Component =================
const Products = ({ refreshTrigger }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (error) {
      console.error("خطا در دریافت محصولات:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-product/${id}`);
      setProducts(products.filter((p) => p.id !== id)); // حذف از لیست محلی
    } catch (error) {
      console.error("خطا در حذف محصول:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        لیست محصولات
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>نام محصول</TableCell>
            <TableCell>توضیح</TableCell>
            <TableCell>قیمت</TableCell>
            <TableCell>تصویر</TableCell>
            <TableCell>عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.desc}</TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Button color="error" onClick={() => handleDelete(p.id)}>
                  حذف
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

// ================= AdminPanel =================
const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState("products");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // فرم افزودن محصول
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [addMessage, setAddMessage] = useState("");

  const handleOpenAdd = () => setOpenAddModal(true);
  const handleCloseAdd = () => setOpenAddModal(false);

  // انتخاب تصویر و تبدیل به Base64
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // پیش‌نمایش
      setImage(reader.result); // ارسال به سرور
    };
    reader.readAsDataURL(file);
  };

  // افزودن محصول
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/add-product", {
        name,
        desc,
        price,
        image,
      });

      setAddMessage("محصول با موفقیت اضافه شد!");
      setName("");
      setDesc("");
      setPrice("");
      setImage(null);
      setPreview(null);
      setRefreshTrigger((prev) => prev + 1);
      handleCloseAdd();
    } catch (error) {
      console.error("خطا در افزودن محصول:", error);
      setAddMessage("خطا در افزودن محصول!");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6">Admin Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => setActiveComponent("products")}>
            <ListItemText primary="لیست محصولات" />
          </ListItem>
          <ListItem button onClick={handleOpenAdd}>
            <ListItemText primary="افزودن محصول" />
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        {activeComponent === "products" && (
          <Products refreshTrigger={refreshTrigger} />
        )}
      </Box>

      {/* ================= Add Product Modal ================= */}
      <Dialog
        open={openAddModal}
        onClose={handleCloseAdd}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>افزودن محصول</DialogTitle>
        <DialogContent>
          <form onSubmit={addProduct}>
            <input
              type="text"
              placeholder="نام محصول"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
              type="text"
              placeholder="توضیح"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <br />
            <input
              type="number"
              placeholder="قیمت"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <br />
            <input type="file" accept="image/*" onChange={handleImage} />
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginTop: "10px",
                  border: "1px solid #ccc",
                }}
              />
            )}
            <br />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              افزودن محصول
            </Button>
          </form>
          {addMessage && <Typography sx={{ mt: 2 }}>{addMessage}</Typography>}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
