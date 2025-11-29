import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const saved = localStorage.getItem("user");
  let user = null;

  if (saved) {
    try {
      user = JSON.parse(saved);
    } catch (err) {
      console.error("خطا در خواندن localStorage:", err);
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div style={{ padding: 20 }}>
        <h2>⚠️ شما به این بخش دسترسی ندارید!</h2>
        <p>نقش شما: {user.role}</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
