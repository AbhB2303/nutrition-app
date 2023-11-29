import React, { useState } from "react";
import Button from "@mui/material/Button";
import "./Home.css";
import { MealsList } from "../../Components/MealsList/MealsList";
import { TransitionsModal } from "../../Components/Modal/TransitionsModal";
import { RecordModal } from "../../Components/Modal/RecordModal";
import { useAuth0 } from "@auth0/auth0-react";
import { TestChart } from "../../Components/testChart";
import { TestChart2 } from "../../Components/TestChart2";
import { Checkbox } from "@mui/material";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffect } from "react";
import axios from "axios";

export const Home = () => {
  const [open, setOpen] = useState(false);
  const [listOfMeals, setListOfMeals] = useState([]);
  const [mealForGraph2, setMealForGraph2] = useState(null);
  const [timePeriod, setTimePeriod] = useState("day");
  const { user } = useAuth0();
  const [openRecord, setOpenRecord] = useState(false);

  const openCreateMealModal = () => {
    setOpen(true);
  };

  const openRecordMealModal = () => {
    setOpenRecord(true);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_SERVER_URL}/get_meals/${user.email}`)
      .then((res) => {
        console.log(res.data);
        setListOfMeals(res.data);
      });
  }, []);

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
      {/* Mostly taken from example, needs to be customized for app */}
      <div className="home-body">
        <div className="graph-container">
          <div className="graph-1">
            <TestChart />
          </div>
          <div className="graph-1">
            <TestChart2 />
          </div>
        </div>
        <div className="meals-saved-list">
          {listOfMeals && (
            <MealsList
              ListOfMeals={listOfMeals}
              setListOfMeals={setListOfMeals}
            />
          )}
        </div>
      </div>
      <div className="graph-options">
        <div className="graph-options-container">
          <h3 style={{ textAlign: "left" }}>Graph Options</h3>
          <p>Configure Meals Over Time Graph</p>
          <div>
            <Checkbox /> Show Total Lipid (Fat)
            <Checkbox /> Show Protein
            <Checkbox /> Show Carbs
            <Checkbox /> Show Fiber
            <Checkbox /> Show Sugar
            <Select
              style={{ margin: "10px" }}
              value={timePeriod}
              label="Time Period"
              onChange={(e) => {
                setTimePeriod(e.target.value);
              }}
            >
              <MenuItem value={"day"}>Day</MenuItem>
              <MenuItem value={"week"}>Week</MenuItem>
              <MenuItem value={"month"}>Month</MenuItem>
              <MenuItem value={"year"}>Year</MenuItem>
            </Select>
            <Button>Submit</Button>
          </div>
          <p>Configure Meals Chart</p>
          <div>
            <Checkbox /> Show Total Lipid (Fat)
            <Checkbox /> Show Protein
            <Checkbox /> Show Carbs
            <Checkbox /> Show Fiber
            <Checkbox /> Show Sugar
            <Select
              style={{ margin: "10px" }}
              value={timePeriod}
              label="Time Period"
              onChange={(e) => {
                setTimePeriod(e.target.value);
              }}
            >
              <MenuItem value={"day"}>Day</MenuItem>
              <MenuItem value={"week"}>Week</MenuItem>
              <MenuItem value={"month"}>Month</MenuItem>
              <MenuItem value={"year"}>Year</MenuItem>
            </Select>
            <Select
              style={{ margin: "10px" }}
              label="Meals to Include"
              onChange={(e) => {
                setMealForGraph2(e.target.value);
              }}
            >
              {listOfMeals &&
                listOfMeals.map((meal) => (
                  <MenuItem value={meal._id}>{meal.MealName}</MenuItem>
                ))}
            </Select>
            <Button>Submit</Button>
          </div>
        </div>
        <div className="graph-options-container-2">
          <h2>New Recommendations</h2>
          <p>
            {" "}
            Looks like your protien intake is low. Try adding more protien to
            your meals.
          </p>
          <p>
            {" "}
            Looks like your fat intake is high. Try adding less fat to your
            meals.
          </p>
        </div>
      </div>

      <TransitionsModal open={open} setOpen={setOpen} />
      <RecordModal open={openRecord} setOpen={setOpenRecord} />
    </div>
  );
};
