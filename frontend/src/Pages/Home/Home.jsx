import React, { useState } from "react";
import Button from "@mui/material/Button";
import "./Home.css";
import { MealsList } from "../../Components/MealsList/MealsList";
import { TransitionsModal } from "../../Components/Modal/TransitionsModal";
import { RecordModal } from "../../Components/Modal/RecordModal";
import { useAuth0 } from "@auth0/auth0-react";

export const Home = () => {
  const [open, setOpen] = useState(false);
  const [mealsList, setMealsList] = useState([]);
  const { user } = useAuth0();
  const [openRecord, setOpenRecord] = useState(false);

  const openCreateMealModal = () => {
    setOpen(true);
  };

  const openRecordMealModal = () => {
    setOpenRecord(true);
  };

  return (
    <div className="home-container">
      {/* <div className="side-bar">
        <div className="side-bar-item">Home</div>
        <div className="side-bar-item">Meals</div>
        <div className="side-bar-item">Settings</div>
      </div> */}

      <div className="home-header">
        <h1 className="home-title">Welcome to Meal Tracker</h1>
        <div className="home-options">
          <Button
            key="Record a new meal"
            style={{ margin: "10px" }}
            onClick={() => {
              openRecordMealModal();
            }}
          >
            Record a new meal
          </Button>
          <Button
            key="Create a new meal"
            style={{ margin: "10px" }}
            onClick={() => {
              openCreateMealModal();
            }}
          >
            Create a new meal
          </Button>
        </div>
      </div>
      <div className="home-body">
        <div className="graph-container">
          <div className="graph-1">Graph Placeholder</div>
          <div className="graph-1">Graph Placeholder</div>
        </div>
        <div className="meals-saved-list">
          <MealsList mealsList={mealsList} />
        </div>
      </div>
      <div className="placeholder">Placeholder</div>

      <TransitionsModal open={open} setOpen={setOpen} />
      <RecordModal open={openRecord} setOpen={setOpenRecord} />
    </div>
  );
};
