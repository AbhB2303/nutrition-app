import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home/Home";
import { Navigator } from "./Components/navigator/navigator";
import Landing from "./Pages/Landing/Landing";
import { AuthenticationGuard } from "./Authentication/authentication-guard";
import Login from "./Authentication/Login";
import Profile from "./Pages/Profile/profile";
import Logout from "./Authentication/Logout";

function App() {
  return (
    <div className="App">
      <div>
        <Navigator />
      </div>
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/home"
            element={<AuthenticationGuard component={Home} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route
            path="/profile"
            element={<AuthenticationGuard component={Profile} />}
          />
        </Routes>
      </div>
      <div>
        <footer className="footer">Footer</footer>
      </div>
    </div>
  );
}

export default App;
