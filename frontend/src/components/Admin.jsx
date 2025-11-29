// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   CssBaseline,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Box,
//   Button,
//   Grid,
//   Card,
//   CardActionArea,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   Avatar,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const drawerWidth = 240;

// /* ===================== PRODUCTS ===================== */
// const Products = ({ refreshTrigger }) => {
//   const [products, setProducts] = useState([]);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/products");
//       setProducts(res.data);
//     } catch (error) {
//       console.error("خطا در دریافت محصولات:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [refreshTrigger]);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/delete-product/${id}`);
//       setProducts(products.filter((p) => p.id !== id));
//     } catch (error) {
//       console.error("خطا در حذف محصول:", error);
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>
//         محصولات موجود
//       </Typography>
//       <Grid container spacing={2}>
//         {products.map((p) => (
//           <Grid item xs={12} sm={6} md={4} key={p.id}>
//             <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
//               <CardActionArea>
//                 {p.image && (
//                   <Box sx={{ height: 180, overflow: "hidden" }}>
//                     <img
//                       src={p.image}
//                       alt={p.name}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   </Box>
//                 )}
//                 <Box sx={{ p: 2 }}>
//                   <Typography variant="h6">{p.name}</Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {p.desc}
//                   </Typography>
//                   <Typography variant="subtitle1" sx={{ mt: 1 }}>
//                     {p.price} تومان
//                   </Typography>
//                   <Button
//                     color="error"
//                     variant="outlined"
//                     sx={{ mt: 1 }}
//                     fullWidth
//                     onClick={() => handleDelete(p.id)}
//                   >
//                     حذف
//                   </Button>
//                 </Box>
//               </CardActionArea>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// /* ===================== USERS MODAL ===================== */
// const UsersModal = ({ open, onClose, onSelect }) => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     if (!open) return;

//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/users");
//         setUsers(res.data);
//       } catch (err) {
//         console.log("خطا در گرفتن یوزرها:", err);
//       }
//     };

//     fetchUsers();
//   }, [open]);

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="sm"
//       PaperProps={{
//         sx: { borderRadius: 3, p: 2, backgroundColor: "#f9f9f9" },
//       }}
//     >
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <DialogTitle sx={{ m: 0 }}>کاربران</DialogTitle>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <DialogContent>
//         {users.length === 0 ? (
//           <Typography textAlign="center" sx={{ py: 3 }}>
//             هیچ کاربری یافت نشد
//           </Typography>
//         ) : (
//           <Grid container spacing={2}>
//             {users.map((u) => (
//               <Grid item xs={12} sm={6} key={u.id}>
//                 <Card
//                   sx={{
//                     borderRadius: 2,
//                     "&:hover": { boxShadow: 6, cursor: "pointer" },
//                   }}
//                 >
//                   <CardActionArea sx={{ p: 2 }} onClick={() => onSelect(u)}>
//                     <Box display="flex" alignItems="center" gap={2}>
//                       <Avatar
//                         src={u.avatar || ""}
//                         alt={`${u.firstname} ${u.lastname}`}
//                         sx={{ width: 50, height: 50, bgcolor: "#1976d2" }}
//                       >
//                         {u.firstname?.[0]}
//                       </Avatar>
//                       <Box>
//                         <Typography variant="h6">
//                           {u.firstname} {u.lastname}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {u.phone} - {u.role || "user"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// /* ===================== EDIT USER ===================== */
// const EditUser = ({ user, onBack }) => {
//   const [form, setForm] = useState({
//     firstname: user.firstname,
//     lastname: user.lastname,
//     phone: user.phone,
//     nationalId: user.nationalId,
//     birthdate: user.birthdate,
//     role: user.role || "user",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const save = async () => {
//     try {
//       await axios.put(`http://localhost:5000/update-user/${user.id}`, form);
//       onBack();
//     } catch (err) {
//       console.log("خطا:", err);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 500 }}>
//       <Button onClick={onBack} sx={{ mb: 2 }}>
//         بازگشت
//       </Button>
//       <Typography variant="h5" gutterBottom>
//         ویرایش کاربر
//       </Typography>
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         <TextField
//           name="firstname"
//           label="نام"
//           value={form.firstname}
//           onChange={handleChange}
//         />
//         <TextField
//           name="lastname"
//           label="نام خانوادگی"
//           value={form.lastname}
//           onChange={handleChange}
//         />
//         <TextField
//           name="phone"
//           label="شماره همراه"
//           value={form.phone}
//           onChange={handleChange}
//         />
//         <TextField
//           name="nationalId"
//           label="کد ملی"
//           value={form.nationalId}
//           onChange={handleChange}
//         />
//         <TextField
//           name="birthdate"
//           label="تاریخ تولد"
//           value={form.birthdate}
//           onChange={handleChange}
//         />
//         <TextField
//           name="role"
//           label="نقش"
//           value={form.role}
//           onChange={handleChange}
//         />
//         <Button onClick={save} variant="contained" sx={{ mt: 1 }}>
//           ذخیره تغییرات
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// /* ===================== MAIN PANEL ===================== */
// const AdminPanel = () => {
//   const [activeComponent, setActiveComponent] = useState("products");
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openUsersModal, setOpenUsersModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const navigate = useNavigate();

//   /* ----- افزودن محصول ----- */
//   const [name, setName] = useState("");
//   const [desc, setDesc] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreview(reader.result);
//       setImage(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const addProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/add-product", {
//         name,
//         desc,
//         price,
//         image,
//       });
//       setName("");
//       setDesc("");
//       setPrice("");
//       setImage(null);
//       setPreview(null);
//       setRefreshTrigger((prev) => prev + 1);
//       setOpenAddModal(false);
//     } catch (error) {
//       console.error("خطا در افزودن محصول:", error);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />

//       {/* ---- TOP BAR ---- */}
//       <AppBar
//         position="fixed"
//         sx={{
//           zIndex: 1201,
//           backgroundColor: "#1976d2",
//           boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Toolbar>
//           <Typography
//             variant="h6"
//             sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
//           >
//             داشبورد مدیریت
//           </Typography>
//           <Tooltip title="رفتن به صفحه اصلی">
//             <Button
//               color="inherit"
//               variant="outlined"
//               sx={{ borderColor: "#fff", color: "#fff", ml: 1 }}
//               onClick={() => navigate("/")}
//             >
//               خانه
//             </Button>
//           </Tooltip>
//         </Toolbar>
//       </AppBar>

//       {/* ---- DRAWER ---- */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//             boxSizing: "border-box",
//           },
//         }}
//       >
//         <Toolbar />
//         <List>
//           <ListItem button onClick={() => setOpenAddModal(true)}>
//             <ListItemText primary="افزودن محصول" />
//           </ListItem>

//           <ListItem button onClick={() => setOpenUsersModal(true)}>
//             <ListItemText primary="مدیریت کاربران" />
//           </ListItem>
//         </List>
//       </Drawer>

//       {/* ---- MAIN CONTENT ---- */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <Toolbar />
//         {!selectedUser && activeComponent === "products" && (
//           <Products refreshTrigger={refreshTrigger} />
//         )}
//         {selectedUser && (
//           <EditUser user={selectedUser} onBack={() => setSelectedUser(null)} />
//         )}
//       </Box>

//       {/* ---- MODAL افزودن محصول ---- */}
//       <Dialog
//         open={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         fullWidth
//         maxWidth="sm"
//         PaperProps={{
//           sx: { borderRadius: 3, p: 3, backgroundColor: "#f9f9f9" },
//         }}
//       >
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <DialogTitle sx={{ m: 0 }}>افزودن محصول</DialogTitle>
//           <IconButton onClick={() => setOpenAddModal(false)}>
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         <DialogContent>
//           <Box
//             component="form"
//             onSubmit={addProduct}
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//               mt: 1,
//             }}
//           >
//             <TextField
//               label="نام محصول"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               fullWidth
//               variant="outlined"
//             />
//             <TextField
//               label="توضیحات"
//               value={desc}
//               onChange={(e) => setDesc(e.target.value)}
//               fullWidth
//               multiline
//               rows={3}
//               variant="outlined"
//             />
//             <TextField
//               label="قیمت (تومان)"
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               fullWidth
//               variant="outlined"
//             />
//             <Button
//               variant="outlined"
//               component="label"
//               sx={{ borderRadius: 2 }}
//             >
//               انتخاب تصویر
//               <input
//                 type="file"
//                 accept="image/*"
//                 hidden
//                 onChange={handleImage}
//               />
//             </Button>

//             {preview && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   mt: 1,
//                   borderRadius: 2,
//                   overflow: "hidden",
//                   boxShadow: 3,
//                 }}
//               >
//                 <img
//                   src={preview}
//                   alt="preview"
//                   style={{ width: 150, height: 150, objectFit: "cover" }}
//                 />
//               </Box>
//             )}

//             <Button
//               type="submit"
//               variant="contained"
//               sx={{ mt: 2, borderRadius: 2, py: 1.2 }}
//             >
//               افزودن محصول
//             </Button>
//           </Box>
//         </DialogContent>
//       </Dialog>

//       {/* ---- USERS MODAL ---- */}
//       <UsersModal
//         open={openUsersModal}
//         onClose={() => setOpenUsersModal(false)}
//         onSelect={(user) => {
//           setSelectedUser(user);
//           setOpenUsersModal(false);
//         }}
//       />
//     </Box>
//   );
// };

// export default AdminPanel;
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
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        محصولات موجود
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 2, backgroundColor: "#f9f9f9" },
      }}
    >
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
                  <CardActionArea sx={{ p: 2 }} onClick={() => onSelect(u.id)}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={u.avatar || ""}
                        alt={`${u.firstname} ${u.lastname}`}
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

/* ===================== EDIT USER ===================== */
const EditUser = ({ userId, onBack }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/${userId}`);
        setForm(res.data);
      } catch (err) {
        console.error("خطا در گرفتن اطلاعات کاربر:", err);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      await axios.put(`http://localhost:5000/update-user/${userId}`, form);
      onBack();
    } catch (err) {
      console.error("خطا در ذخیره تغییرات:", err);
    }
  };

  if (!form) return <Typography>در حال بارگذاری اطلاعات کاربر...</Typography>;

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
        <Button variant="contained" sx={{ mt: 1 }} onClick={save}>
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
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

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
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          backgroundColor: "#1976d2",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
          >
            داشبورد مدیریت
          </Typography>
          <Tooltip title="رفتن به صفحه اصلی">
            <Button
              color="inherit"
              variant="outlined"
              sx={{ borderColor: "#fff", color: "#fff", ml: 1 }}
              onClick={() => navigate("/")}
            >
              خانه
            </Button>
          </Tooltip>
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
          <ListItem button onClick={() => setOpenAddModal(true)}>
            <ListItemText primary="افزودن محصول" />
          </ListItem>
          <ListItem button onClick={() => setOpenUsersModal(true)}>
            <ListItemText primary="مدیریت کاربران" />
          </ListItem>
        </List>
      </Drawer>

      {/* ---- MAIN CONTENT ---- */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {!selectedUserId && activeComponent === "products" && (
          <Products refreshTrigger={refreshTrigger} />
        )}
        {selectedUserId && (
          <EditUser
            userId={selectedUserId}
            onBack={() => setSelectedUserId(null)}
          />
        )}
      </Box>

      {/* ---- MODAL افزودن محصول ---- */}
      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, p: 3, backgroundColor: "#f9f9f9" },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <DialogTitle sx={{ m: 0 }}>افزودن محصول</DialogTitle>
          <IconButton onClick={() => setOpenAddModal(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          <Box
            component="form"
            onSubmit={addProduct}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
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
            <Button
              variant="outlined"
              component="label"
              sx={{ borderRadius: 2 }}
            >
              انتخاب تصویر
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
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

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, borderRadius: 2, py: 1.2 }}
            >
              افزودن محصول
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ---- USERS MODAL ---- */}
      <UsersModal
        open={openUsersModal}
        onClose={() => setOpenUsersModal(false)}
        onSelect={(id) => {
          setSelectedUserId(id);
          setOpenUsersModal(false);
        }}
      />
    </Box>
  );
};

export default AdminPanel;
