import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/IMG_2181.png';
import { useAuth0 } from "@auth0/auth0-react";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  return (
    <div style={{ textAlign: "center", margin: "100px 100px 350px 100px" }}>
      <img src={logo} alt="Logo" style={{ width: '150px' }} />
      <h1 style={{ fontSize: "45px" }}>Nutriboard</h1>
      <p> Welcome to the nutrition dashboard app!</p>
      <p> Use this application to track and monitor your eating habits.</p>
      {isAuthenticated ? <p>You are logged in, go to your dashboard to get started</p> : (
        <div>
          <p>
            To get started please log in or create an account.
          </p>
          <Button
            style={{ fontSize: "16px" }}
            variant="contained"
            onClick={() => navigate("/login")}
          >Get started
          </Button>
        </div>
      )}

    </div>
  );
};

export default Landing;
