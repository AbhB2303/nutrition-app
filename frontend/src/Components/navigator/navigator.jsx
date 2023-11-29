import React from "react";
import "./navigator.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const Navigator = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth0();

  return (
    <div className="navbar">
      <header className="navbar-header">
        <p style={{ margin: "0.5rem" }}>Nutrition App</p>

        {isAuthenticated ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "white",
            }}
          >
            <Button color="inherit" onClick={() => navigate("/home")}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate("/profile")}>
              Profile
            </Button>
            <Button
              color="inherit"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate("/login")}>Login</Button>
        )}
      </header>
    </div>
  );
};

export default Navigator;
