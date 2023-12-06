import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Landing = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <div style={{ textAlign: "center", margin: "300px" }}>
      <h1>Home</h1>
      <p> Welcome to the nutrition app</p>
      <p> Use this application to track and monitor your eating habits.</p>
      {isAuthenticated ? <p>You are logged in, go to your dashboard to get started</p> : (
        <p>
        You are currently logged out. To get started please log in on the top
        right of the navigation menu.
      </p>
      )}
      
    </div>
  );
};

export default Landing;
