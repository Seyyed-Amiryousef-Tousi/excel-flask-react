import React, { useState } from "react";
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

    setForm((prev) => ({ ...prev, imageFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price) {
      alert("لطفاً همه فیلدها را پر کنید");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);

      if (form.imageFile) {
        data.append("image", form.imageFile);
      }

      await axios.post("http://127.0.0.1:5000/add-product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("محصول اضافه شد");

      setForm({ name: "", description: "", price: "", imageFile: null });
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت محصول");
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 520,
        mx: "auto",
        mt: 5,
        p: 4,
        borderRadius: 4,
        bgcolor: "#ffffff",
      }}
    >
      <Typography
        variant="h5"
        mb={3}
        textAlign="center"
        sx={{ fontWeight: "bold" }}
      >
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

        <Button
          variant="contained"
          component="label"
          sx={{ py: 1.2, fontWeight: 600 }}
        >
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
              borderRadius: 3,
              mt: 2,
              border: "1px solid #ddd",
            }}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, py: 1.3, fontWeight: 700, fontSize: "1rem" }}
        >
          ثبت محصول
        </Button>
      </Stack>
    </Paper>
  );
}
