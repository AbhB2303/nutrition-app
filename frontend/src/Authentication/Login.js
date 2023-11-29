import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  loginWithRedirect(); // simply show pageloader as redirect occurs

  return <div className="page-layout">loading...</div>;
};

export default Login;
