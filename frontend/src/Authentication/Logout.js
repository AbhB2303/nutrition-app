// react
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// auth0
import { useAuth0 } from "@auth0/auth0-react";
// components

const Logout = () => {
  const { logout } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, [logout, navigate]);

  // simply show pageloader as redirect occurs
  return <div className="page-layout">loading...</div>;
};

export default Logout;
