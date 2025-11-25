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
  Grid,
  Card,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import axios from "axios";

const drawerWidth = 240;

/* ===================== PRODUCTS ===================== */
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
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("خطا در حذف محصول:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        لیست محصولات
      </Typography>
      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardActionArea>
                {p.image && (
                  <Box sx={{ height: 180, overflow: "hidden" }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                )}
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.desc}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    {p.price} تومان
                  </Typography>
                  <Button
                    color="error"
                    variant="outlined"
                    sx={{ mt: 1 }}
                    fullWidth
                    onClick={() => handleDelete(p.id)}
                  >
                    حذف
                  </Button>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

/* ===================== USERS MODAL ===================== */
const UsersModal = ({ open, onClose, onSelect }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data);
      } catch (err) {
        console.log("خطا در گرفتن یوزرها:", err);
      }
    };

    fetchUsers();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>کاربران</DialogTitle>
      <DialogContent>
        {users.length === 0 ? (
          <Typography textAlign="center" sx={{ py: 3 }}>
            هیچ یوزری لاگین نکرده
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {users.map((u) => (
              <Grid item xs={12} sm={6} key={u.id}>
                <Card>
                  <CardActionArea
                    sx={{ p: 2 }}
                    onClick={() => onSelect(u)}
                  >
                    <Typography variant="h6">{u.firstname} {u.lastname}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {u.phone} - {u.role || "user"}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ===================== EDIT USER ===================== */
const EditUser = ({ user, onBack }) => {
  const [form, setForm] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    phone: user.phone,
    nationalId: user.nationalId,
    birthdate: user.birthdate,
    role: user.role || "user",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      await axios.put(`http://localhost:5000/update-user/${user.id}`, form);
      onBack();
    } catch (err) {
      console.log("خطا:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Button onClick={onBack} sx={{ mb: 2 }}>
        بازگشت
      </Button>
      <Typography variant="h5" gutterBottom>
        ویرایش کاربر
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          name="firstname"
          label="نام"
          value={form.firstname}
          onChange={handleChange}
        />
        <TextField
          name="lastname"
          label="نام خانوادگی"
          value={form.lastname}
          onChange={handleChange}
        />
        <TextField
          name="phone"
          label="شماره همراه"
          value={form.phone}
          onChange={handleChange}
        />
        <TextField
          name="nationalId"
          label="کد ملی"
          value={form.nationalId}
          onChange={handleChange}
        />
        <TextField
          name="birthdate"
          label="تاریخ تولد"
          value={form.birthdate}
          onChange={handleChange}
        />
        <TextField
          name="role"
          label="نقش"
          value={form.role}
          onChange={handleChange}
        />
        <Button onClick={save} variant="contained" sx={{ mt: 1 }}>
          ذخیره تغییرات
        </Button>
      </Box>
    </Box>
  );
};

/* ===================== MAIN PANEL ===================== */
const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState("products");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUsersModal, setOpenUsersModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /* ----- افزودن محصول ----- */
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/add-product", {
        name,
        desc,
        price,
        image,
      });
      setName("");
      setDesc("");
      setPrice("");
      setImage(null);
      setPreview(null);
      setRefreshTrigger((prev) => prev + 1);
      setOpenAddModal(false);
    } catch (error) {
      console.error("خطا در افزودن محصول:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ---- TOP BAR ---- */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6">Admin Dashboard</Typography>
        </Toolbar>
      </AppBar>

      {/* ---- DRAWER ---- */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
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

          <ListItem button onClick={() => setOpenAddModal(true)}>
            <ListItemText primary="افزودن محصول" />
          </ListItem>

          <ListItem button onClick={() => setOpenUsersModal(true)}>
            <ListItemText primary="Users" />
          </ListItem>
        </List>
      </Drawer>

      {/* ---- MAIN CONTENT ---- */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {!selectedUser && activeComponent === "products" && (
          <Products refreshTrigger={refreshTrigger} />
        )}
        {selectedUser && (
          <EditUser user={selectedUser} onBack={() => setSelectedUser(null)} />
        )}
      </Box>

      {/* ---- MODAL افزودن محصول ---- */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>افزودن محصول</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={addProduct} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="نام" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              fullWidth
            />
            <TextField 
              label="توضیح" 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              fullWidth
            />
            <TextField 
              label="قیمت" 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              fullWidth
            />
            <Button variant="outlined" component="label">
              انتخاب تصویر
              <input type="file" accept="image/*" hidden onChange={handleImage} />
            </Button>
            {preview && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img src={preview} alt="preview" style={{ width: 120, height: 120, borderRadius: 10 }} />
              </Box>
            )}
            <Button type="submit" variant="contained" sx={{ mt: 1 }}>
              افزودن
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ---- USERS MODAL ---- */}
      <UsersModal
        open={openUsersModal}
        onClose={() => setOpenUsersModal(false)}
        onSelect={(user) => {
          setSelectedUser(user);
          setOpenUsersModal(false);
        }}
      />
    </Box>
  );
};

export default AdminPanel;
