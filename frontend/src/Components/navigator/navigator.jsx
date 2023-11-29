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
      <header>
        <p>Nutrition App</p>
        {isAuthenticated ? (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/home")}
            >
              Home
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </header>
    </div>
  );
};

export default Navigator;
