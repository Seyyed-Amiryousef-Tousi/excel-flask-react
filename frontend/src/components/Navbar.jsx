import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Link } from "react-router-dom";
import logo from "../assets/image/logo.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const links = [
    { to: "/", label: "لیست محصولات" },
    { to: "/Admin", label: "داشبورد" },
  ];

  const drawerContent = (
    <Box sx={{ width: 240, p: 2, direction: "rtl" }}>
      {links.map((item) => (
        <Button
          key={item.to}
          component={Link}
          to={item.to}
          onClick={toggleDrawer}
          sx={{
            display: "block",
            width: "100%",
            justifyContent: "flex-start",
            fontSize: "0.95rem",
          }}
        >
          {item.label}
        </Button>
      ))}

      {/* Login - Mobile */}
      <Button
        component={Link}
        to="/login"
        onClick={toggleDrawer}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          justifyContent: "flex-start",
          mt: 2,
        }}
      >
        <LoginIcon />
        ورود
      </Button>

      {/* Sign Up - Mobile */}
      <Button
        component={Link}
        to="/register"
        onClick={toggleDrawer}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          justifyContent: "flex-start",
          mt: 1,
        }}
      >
        <PersonAddAltIcon />
        ثبت‌نام
      </Button>
    </Box>
  );

  return (
    <Box sx={{ direction: "rtl", mb: 3 }}>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          bgcolor: "#ffffff",
          color: "#000",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Mobile Menu Button */}
          <IconButton
            onClick={toggleDrawer}
            sx={{ display: { md: "none" }, color: "#000" }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: "42px", objectFit: "contain" }}
            />
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {links.map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                sx={{ color: "#000", fontSize: "0.95rem" }}
              >
                {item.label}
              </Button>
            ))}

            {/* Login - Desktop */}
            <Button
              component={Link}
              to="/login"
              sx={{
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LoginIcon />
              ورود
            </Button>

            {/* Sign Up - Desktop */}
            <Button
              component={Link}
              to="/signup"
              sx={{
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonAddAltIcon />
              ثبت‌نام
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={toggleDrawer}
        anchor="right"
        sx={{ display: { md: "none" } }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}