import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";

export default function Login() {
  const [form, setForm] = useState({ phone: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", form);

      // ذخیره داده صحیح
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.token,
          role: res.data.role,
        })
      );

      window.location.href = "/admin";
    } catch (e) {
      alert("ورود ناموفق");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2}>ورود</Typography>

        <TextField fullWidth label="شماره همراه" name="phone" onChange={handleChange} margin="dense" />
        <TextField fullWidth label="رمز عبور" type="password" name="password" onChange={handleChange} margin="dense" />

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={submit}>
          ورود
        </Button>
      </Paper>
    </Box>
  );
}
