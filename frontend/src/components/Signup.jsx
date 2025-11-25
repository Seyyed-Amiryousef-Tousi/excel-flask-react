// Signup.jsx
import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";

export default function Signup() {
  // State فرم با نام‌های دقیق مطابق Flask
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    nationalCode: "",
    birthDate: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    // بررسی ساده قبل از ارسال
    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "nationalCode",
      "birthDate",
      "password",
    ];
    for (let field of requiredFields) {
      if (!form[field]) {
        alert(`فیلد ${field} را تکمیل کنید`);
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/register", form, {
        headers: { "Content-Type": "application/json" },
      });
      alert("ثبت‌نام انجام شد");
      window.location.href = "/login";
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        alert("خطا: " + e.response.data.error);
      } else {
        alert("خطا در اتصال به سرور یا ارور ناشناخته");
        console.error(e);
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>
          ثبت‌نام
        </Typography>

        <TextField
          fullWidth
          label="نام"
          name="firstName"
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="نام خانوادگی"
          name="lastName"
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="شماره همراه"
          name="phone"
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="کدملی"
          name="nationalCode"
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          type="date"
          name="birthDate"
          onChange={handleChange}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="ایمیل (اختیاری)"
          name="email"
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="رمز عبور"
          type="password"
          name="password"
          onChange={handleChange}
          margin="dense"
        />

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={submit}>
          ثبت‌نام
        </Button>
      </Paper>
    </Box>
  );
}
