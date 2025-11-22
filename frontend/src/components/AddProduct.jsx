import { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageFile: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ذخیره فایل در state
  setForm(prev => ({ ...prev, imageFile: file }));

  // ساخت Base64 برای پیش‌نمایش
  const reader = new FileReader();
  reader.onloadend = () => {
    setPreview(reader.result); // Base64
    setForm(prev => ({ ...prev, image: reader.result })); // آماده ارسال JSON
  };
  reader.readAsDataURL(file);
};


  const handleSubmit = async (e) => {
    e.preventDefault(); // جلوگیری از reload صفحه

    // بررسی فیلدهای ضروری
    if (!form.name || !form.description || !form.price) {
      alert("لطفاً همه فیلدها را پر کنید");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);

      // فقط اگر فایل انتخاب شده باشد
      if (form.imageFile) {
        data.append("image", form.imageFile);
      }

      // ارسال به سرور
      await axios.post("http://127.0.0.1:5000/add-product", data);

      alert("محصول اضافه شد");

      // ریست فرم و پیش‌نمایش
      setForm({ name: "", description: "", price: "", imageFile: null });
      setPreview(null);
    } catch (err) {
      console.error(err.response || err);
      alert("خطا در ثبت محصول");
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
        p: 4,
        borderRadius: 3,
        bgcolor: "#fafafa",
      }}
    >
      <Typography variant="h5" mb={3} textAlign="center">
        افزودن محصول جدید
      </Typography>

      <Stack component="form" spacing={3} onSubmit={handleSubmit}>
        <TextField
          label="نام محصول"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="توضیحات"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          required
        />

        <TextField
          label="قیمت"
          name="price"
          value={form.price}
          type="number"
          onChange={handleChange}
          fullWidth
          required
        />

        <Button variant="contained" component="label">
          آپلود تصویر
          <input type="file" hidden accept="image/*" onChange={handleImage} />
        </Button>

        {preview && (
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              width: "100%",
              borderRadius: 2,
              mt: 1,
              border: "1px solid #ccc",
            }}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          ثبت محصول
        </Button>
      </Stack>
    </Paper>
  );
}
