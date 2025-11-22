import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  Box,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link } from "react-router-dom";
import logo from "../assets/image/logo.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const openProfileMenu = (event) => setAnchorEl(event.currentTarget);
  const closeProfileMenu = () => setAnchorEl(null);

  const links = [
    { to: "/", label: "لیست محصولات" },
    { to: "/Admin", label: "داشبورد" },
  ];

  const drawerContent = (
    <Box sx={{ width: 220, p: 2, direction: "rtl" }}>
      {links.map((item) => (
        <Button
          key={item.to}
          component={Link}
          to={item.to}
          onClick={toggleDrawer}
          sx={{ display: "block", width: "100%", justifyContent: "flex-start" }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  return (
    <Box sx={{ direction: "rtl" }}>
      <AppBar
        position="static"
        color={darkMode ? "primary" : "default"}
        sx={{ bgcolor: darkMode ? "#111" : "#f8f8f8" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Mobile menu */}
          <IconButton onClick={toggleDrawer} sx={{ display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to=""
            sx={{
              textDecoration: "none",
              color: darkMode ? "#fff" : "#000",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="my logo"
              style={{ height: "40px", objectFit: "contain" }}
            />
          </Typography>

          {/* Desktop links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {links.map((item) => (
              <Button key={item.to} component={Link} to={item.to}>
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Dark mode */}
            <IconButton onClick={toggleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Notifications */}
            <IconButton>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile */}
            <IconButton onClick={openProfileMenu}>
              <Avatar alt="User" src="/static/images/avatar/1.jpg" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeProfileMenu}
            >
              <MenuItem onClick={closeProfileMenu}>پروفایل</MenuItem>
              <MenuItem onClick={closeProfileMenu}>تنظیمات</MenuItem>
              <MenuItem onClick={closeProfileMenu}>خروج</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
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
