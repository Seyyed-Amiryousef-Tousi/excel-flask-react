// UsersModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

const UsersModal = ({ open, onClose, users, onSelectUser }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>لیست کاربران</DialogTitle>

      <DialogContent>
        {users.length === 0 ? (
          <Typography sx={{ textAlign: "center", p: 3, color: "#888" }}>
            هیچ کاربری لاگین نکرده است
          </Typography>
        ) : (
          <List>
            {users.map((u) => (
              <ListItem
                key={u.id}
                button
                onClick={() => onSelectUser(u)}
                sx={{
                  borderBottom: "1px solid #eee",
                  borderRadius: 2,
                  "&:hover": { background: "#f5f5f5" },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      border: "3px solid #ff006f",
                    }}
                  >
                    {u.name[0]}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={`${u.name} ${u.lastname}`}
                  secondary={u.phone}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UsersModal;
