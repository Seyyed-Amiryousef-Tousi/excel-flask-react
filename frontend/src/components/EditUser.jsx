// EditUser.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const EditUser = ({ user, onBack }) => {
  const [form, setForm] = useState({
    name: user.name,
    lastname: user.lastname,
    phone: user.phone,
    nationalId: user.nationalId,
    birthday: user.birthday,
    role: user.role || "user",
  });

  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${user.id}`, form);
      alert("کاربر با موفقیت ویرایش شد");
      onBack();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        ویرایش کاربر
      </Typography>

      <TextField
        fullWidth
        label="نام"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="نام خانوادگی"
        value={form.lastname}
        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="شماره همراه"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="کد ملی"
        value={form.nationalId}
        onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="تاریخ تولد"
        value={form.birthday}
        onChange={(e) => setForm({ ...form, birthday: e.target.value })}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={updateUser}>
        ذخیره تغییرات
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 1 }}
        onClick={onBack}
      >
        بازگشت
      </Button>
    </Box>
  );
};

export default EditUser;
