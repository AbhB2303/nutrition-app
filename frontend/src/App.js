import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home/Home";
import { Navigator } from "./Components/navigator/navigator";

function App() {
  return (
    <div className="App">
      <div>
        <Navigator />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <div>
        <footer>Footer</footer>
      </div>
    </div>
  );
}

export default App;
