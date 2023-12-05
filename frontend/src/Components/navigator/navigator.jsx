import React from "react";
import "./navigator.css";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "@mui/material/Link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Logo from "../Logo";

export const Navigator = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth0();

  return (
    <div className="navbar">
      <header className="navbar-header">
        <div style={{ display: "inline-flex" }}>
          <Logo style={{ display: "flex" }} />
          <Link
            underline="none"
            href="/home"
            style={{ margin: "0.5rem", color: "#00382e", display: "flex" }}
          >
            Nutrition App
          </Link>
        </div>
        {isAuthenticated ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              startIcon={<DashboardIcon />}
              color="inherit"
              onClick={() => navigate("/home")}
            >
              Dashboard
            </Button>
            <Button
              startIcon={<AccountCircleIcon />}
              color="inherit"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
            <Button
              startIcon={<LogoutIcon />}
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
