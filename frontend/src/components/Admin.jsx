import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Box,
  Button,
  Grid,
  Card,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";

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

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        محصولات موجود
      </Typography>
      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <CardActionArea>
                {p.image && (
                  <Box sx={{ height: 180, overflow: "hidden" }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
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
const UsersModal = ({ open, onClose }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!open) return;
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data);
      } catch (err) {
        console.error("خطا در گرفتن یوزرها:", err);
      }
    };
    fetchUsers();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ m: 0 }}>کاربران</DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        {users.length === 0 ? (
          <Typography textAlign="center" sx={{ py: 3 }}>
            هیچ کاربری یافت نشد
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {users.map((u) => (
              <Grid item xs={12} sm={6} key={u.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    "&:hover": { boxShadow: 6, cursor: "pointer" },
                  }}
                >
                  <CardActionArea sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={u.avatar || ""}
                        sx={{ width: 50, height: 50, bgcolor: "#1976d2" }}
                      >
                        {u.firstname?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {u.firstname} {u.lastname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {u.phone} - {u.role || "user"}
                        </Typography>
                      </Box>
                    </Box>
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

/* ===================== ADD PRODUCT MODAL ===================== */
const AddProductModal = ({
  open,
  onClose,
  refreshTrigger,
  setRefreshTrigger,
}) => {
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
      onClose();
    } catch (err) {
      console.error("خطا در افزودن محصول:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ m: 0 }}>افزودن محصول</DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Box
          component="form"
          onSubmit={addProduct}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="نام محصول"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="توضیحات"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
          <TextField
            label="قیمت (تومان)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Button variant="outlined" component="label">
            انتخاب تصویر
            <input type="file" accept="image/*" hidden onChange={handleImage} />
          </Button>
          {preview && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 1,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
              <img
                src={preview}
                alt="preview"
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
            </Box>
          )}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            افزودن محصول
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

/* ===================== PROFILE MODAL ===================== */
const ProfileModal = ({ open, onClose }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!open) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/profile"); // API پروفایل
        setCurrentUser(res.data);
      } catch (err) {
        console.error("خطا در دریافت پروفایل:", err);
      }
    };
    fetchProfile();
  }, [open]);

  if (!currentUser) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Avatar
        src={currentUser.avatar || ""}
        sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
      >
        {currentUser.firstname?.[0]}
      </Avatar>
      <Typography variant="h6" textAlign="center">
        {currentUser.firstname} {currentUser.lastname}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {currentUser.role || "user"}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {currentUser.phone}
      </Typography>
    </Dialog>
  );
};

/* ===================== MAIN ADMIN PANEL ===================== */
const AdminPanel = () => {
  const [openUsersModal, setOpenUsersModal] = useState(false);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      {/* Buttons بالای صفحه بدون Navbar */}
      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        <Button
          variant="contained"
          onClick={() => setOpenAddProductModal(true)}
        >
          محصولات
        </Button>
        <Button variant="contained" onClick={() => setOpenUsersModal(true)}>
          کاربران
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpenProfileModal(true)}
          startIcon={<AccountCircleIcon />}
        >
          پروفایل
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Products refreshTrigger={refreshTrigger} />
      </Box>

      {/* Modals */}
      <UsersModal
        open={openUsersModal}
        onClose={() => setOpenUsersModal(false)}
      />
      <AddProductModal
        open={openAddProductModal}
        onClose={() => setOpenAddProductModal(false)}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
      />
      <ProfileModal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
      />
    </Box>
  );
};

export default AdminPanel;
