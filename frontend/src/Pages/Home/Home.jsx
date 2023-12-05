import React, { useState } from "react";
import Button from "@mui/material/Button";
import "./Home.css";
import { MealsList } from "../../Components/MealsList/MealsList";
import { TransitionsModal } from "../../Components/Modal/TransitionsModal";
import { RecordModal } from "../../Components/Modal/RecordModal";
import { useAuth0 } from "@auth0/auth0-react";
import { Custom_Chart } from "../../Components/Chart";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const Home = () => {
  const [open, setOpen] = useState(false);
  const [listOfMeals, setListOfMeals] = useState(null);
  const [mealForGraph2, setMealForGraph2] = useState("");
  const [recordedMeals, setRecordedMeals] = useState([]); // [mealName, mealNutritionInfo]
  const [timePeriod, setTimePeriod] = useState("");
  const { user } = useAuth0();
  const [openRecord, setOpenRecord] = useState(false);
  const [tableData, setMealNutrientData] = useState(null);
  const [barChartData, setBarchartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [loadChartData, setLoadChartData] = useState(false);
  // states to handle feedback messages
  const [severityOfMessage, setSeverityOfMessage] = useState(null);
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(true);

  const LineChartOptions = {
    title: "Nutritional Value Of All Meals Over Time",
    hAxis: { title: "Date" },
    vAxis: { title: "Nutritional Value" },
  };

  const BarChartoptions = {
    title: "Nutritional Value Of a Meal",
    vAxis: { title: "Meals" },
    hAxis: { title: "Quantity (grams)" },
  };

  // check if user has an account, otherwise create one
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_SERVER_URL}/get_user/${user.email}`)
      .then((res) => {
        if (res.data === null) {
          let formData = new FormData();
          formData.append("email", user.email);
          axios.post(
            `${process.env.REACT_APP_API_SERVER_URL}/create_user`,
            formData
          );
        }
      });
  }, [user]);

  // set data for bar chart
  const setMealChartData = async (meal) => {
    const meal_id = meal;
    const nutrients = tableData.filter((meal) => {
      return meal.meal._id === meal_id;
    });
    const ChartData = [
      nutrients[0].nutrients["Protein"] ? nutrients[0].nutrients["Protein"] : 0,
      nutrients[0].nutrients["Total lipid (fat)"]
        ? nutrients[0].nutrients["Total lipid (fat)"]
        : 0,
      nutrients[0].nutrients["Carbohydrate, by difference"]
        ? nutrients[0].nutrients["Carbohydrate, by difference"]
        : 0,
      nutrients[0].nutrients["Iron, Fe"]
        ? nutrients[0].nutrients["Iron, Fe"]
        : 0,
      nutrients[0].nutrients["Vitamin D"]
        ? nutrients[0].nutrients["Vitamin D"]
        : 0,
      nutrients[0].nutrients["Vitamin B-12"]
        ? nutrients[0].nutrients["Vitamin B-12"]
        : 0,
      nutrients[0].nutrients["Vitamin B-6"]
        ? nutrients[0].nutrients["Vitamin B-6"]
        : 0,
      nutrients[0].nutrients["Copper, Cu"]
        ? nutrients[0].nutrients["Copper, Cu"]
        : 0,
      nutrients[0].nutrients["Zinc, Zn"]
        ? nutrients[0].nutrients["Zinc, Zn"]
        : 0,
      nutrients[0].nutrients["Iodine, I"]
        ? nutrients[0].nutrients["Iodine, I"]
        : 0,
    ];
    const ChartHeader = [
      "Protein",
      "Fat",
      "Carbs",
      "Iron",
      "Vit. D",
      "Vit. B-12",
      "Vit. B-6",
      "Copper",
      "Zinc",
    ];
    for (let i = 0; i < ChartData.length; i++) {
      if (ChartData[i] === 0) {
        ChartHeader.splice(i, 1);
        ChartData.splice(i, 1);
      }
    }
    setBarchartData([ChartHeader, ChartData]);
  };

  // handle open modal
  const openCreateMealModal = () => {
    setOpen(true);
  };
  const openRecordMealModal = () => {
    setOpenRecord(true);
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_SERVER_URL}/get_all_meal_with_nutrients/${user.email}`
      )
      .then((res) => {
        const mealNutrientData = res.data;
        setMealNutrientData(mealNutrientData);
      });
  }, []);

  useEffect(() => {
    if (tableData) {
      const listOfMeals = tableData.map((meal) => {
        return meal.meal;
      });
      setListOfMeals(listOfMeals);
    }
  }, [tableData]);

  // hides message after 5 seconds if shown
  useEffect(() => {
    setTimeout(() => {
      setSeverityOfMessage(null);
    }, 5000);
  }, [severityOfMessage]);

  // loads line chart data once table data is loaded
  useEffect(() => {
    setMessage("Retrieving Data... (this may take a few seconds)");
    setSeverityOfMessage("info");
    axios
      .get(
        `${process.env.REACT_APP_API_SERVER_URL}/get_recorded_meals/${user.email}`
      )
      .then(async (res) => {
        setRecordedMeals(res.data);
        const ChartHeader = [
          "Date",
          "Protein",
          "Fat",
          "Carbs",
          "Iron",
          "Vit. D",
          "Vit. B-12",
          "Vit. B-6",
          "Copper",
          "Zinc",
        ];
        const ChartData = [ChartHeader];
        for (let i = 0; i < recordedMeals.length; i++) {
          const meal_id = recordedMeals[i]["meal_id"];
          const nutrients = tableData.filter((meal) => {
            return meal.meal._id === meal_id;
          });
          const Data = [
            recordedMeals[i]["date"],
            nutrients[0].nutrients["Protein"]
              ? nutrients[0].nutrients["Protein"]
              : 0,
            nutrients[0].nutrients["Total lipid (fat)"]
              ? nutrients[0].nutrients["Total lipid (fat)"]
              : 0,
            nutrients[0].nutrients["Carbohydrate, by difference"]
              ? nutrients[0].nutrients["Carbohydrate, by difference"]
              : 0,
            nutrients[0].nutrients["Iron, Fe"]
              ? nutrients[0].nutrients["Iron, Fe"]
              : 0,
            nutrients[0].nutrients["Vitamin D"]
              ? nutrients[0].nutrients["Vitamin D"]
              : 0,
            nutrients[0].nutrients["Vitamin B-12"]
              ? nutrients[0].nutrients["Vitamin B-12"]
              : 0,
            nutrients[0].nutrients["Vitamin B-6"]
              ? nutrients[0].nutrients["Vitamin B-6"]
              : 0,
            nutrients[0].nutrients["Copper, Cu"]
              ? nutrients[0].nutrients["Copper, Cu"]
              : 0,
            nutrients[0].nutrients["Zinc, Zn"]
              ? nutrients[0].nutrients["Zinc, Zn"]
              : 0,
          ];
          ChartData.push(Data);
        }
        setLineChartData(ChartData);
        console.log("ChartData", ChartData);
      })
      .finally(() => {
        setMessage("Data retrieved, please wait as your chart loads.");
        setSeverityOfMessage("success");
      });
  }, [tableData]);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Nutrition Dashboard</h1>
        <div className="home-options">
          <Button
            variant="contained"
            key="Record a new meal"
            style={{ margin: "10px" }}
            onClick={() => {
              openRecordMealModal();
            }}
          >
            Record a Meal
          </Button>
          <Button
            variant="contained"
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
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div className="recommendations-container">
            <h3 style={{ textAlign: "left" }}>Recommendation 1</h3>
            <p>
              {" "}
              Looks like your protien intake is low. Try adding more protien to
              your meals.
            </p>
          </div>
          <div className="recommendations-container">
            <h3 style={{ textAlign: "left" }}>Recommendation 2</h3>
            <p>
              {" "}
              Looks like your fat intake is high. Try adding less fat to your
              meals.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div className="graph">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontSize: "20px", marginBottom: "3px" }}>
                  Overall nutritional value over time
                </h3>
                <p style={{ margin: "0", fontSize: "12px" }}>
                  For the past {timePeriod}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  backgroundColor: "white",
                }}
              ></div>
            </div>
            <Custom_Chart
              data={lineChartData}
              graphType={"LineChart"}
              options={LineChartOptions}
            />
          </div>
          <div className="graph">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontSize: "20px", marginBottom: "3px" }}>
                  Nutritional value
                </h3>
                <p style={{ margin: "0", fontSize: "12px" }}>
                  Of a recently consumed item
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  backgroundColor: "white",
                }}
              >
                <FormControl>
                  <InputLabel
                    id="select-helper-label-bar"
                    style={{ margin: "10px", width: "100px" }}
                  >
                    Meal
                  </InputLabel>
                  <Select
                    style={{ margin: "20px", width: "100px" }}
                    value={mealForGraph2}
                    labelId="select-helper-label-bar"
                    onChange={(e) => {
                      setMealForGraph2(e.target.value);
                    }}
                  >
                    {listOfMeals &&
                      listOfMeals.map((meal) => (
                        <MenuItem value={meal._id}>{meal.MealName}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Button
                  disabled={!mealForGraph2 || mealForGraph2 === "" || !tableData}
                  onClick={() => {
                    setMealChartData(mealForGraph2);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
            <Custom_Chart
              data={barChartData}
              graphType={"BarChart"}
              options={BarChartoptions}
            />
          </div>
        </div>
      </div>
      <div className="table-container">
        <TableContainer component={Paper}>
          {tableData && (
            <Table className="table">
              <TableHead>
                <TableRow
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontWeight: "bold"
                  }}
                >
                  <TableCell style={{ fontWeight: "bold" }}>Meal Name</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Protein</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Fat</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Carbs</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Iron</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Vit. D</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Vit. B-12</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Vit. B-6</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Copper</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Zinc</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="table-body">
                {" "}
                {tableData.map((meal) => {
                  return (
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{meal.meal.MealName}</TableCell>
                      <TableCell>
                        {meal.nutrients["Protein"] ? meal.nutrients["Protein"] : 0}
                      </TableCell>
                      <TableCell>
                        {meal.nutrients["Total lipid (fat)"]
                          ? meal.nutrients["Total lipid (fat)"]
                          : 0}
                      </TableCell>
                      <TableCell>
                        {meal.nutrients["Carbohydrate, by difference"]
                          ? meal.nutrients["Carbohydrate, by difference"]
                          : 0}
                      </TableCell>
                      <TableCell>
                        {meal.nutrients["Iron, Fe"]
                          ? meal.nutrients["Iron, Fe"]
                          : 0}
                      </TableCell>
                      <TableCell>
                        {meal.nutrients["Vitamin D"]
                          ? meal.nutrients["Vitamin D"]
                          : 0}
                      </TableCell>
                      <TableCell>
                        {meal.nutrients["Vitamin B-12"]
                          ? meal.nutrients["Vitamin B-12"]
                          : 0}
                      </TableCell>
                      <TableCell>
                        {meal.nutrients["Vitamin B-6"]
                          ? meal.nutrients["Vitamin B-6"]
                          : 0}
                      </TableCell>
                      <TableCell>
                        {meal.nutrients["Copper, Cu"]
                          ? meal.nutrients["Copper, Cu"]
                          : 0}
                      </TableCell>
                      <TableCell>
                        {meal.nutrients["Zinc, Zn"]
                          ? meal.nutrients["Zinc, Zn"]
                          : 0}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </div>


      {severityOfMessage && (
        <Box sx={{ width: "100%" }}>
          <Collapse in={messageOpen}>
            <Alert
              severity={severityOfMessage}
              style={{
                position: "fixed",
                bottom: "10px",
                right: "10px",
                width: "20%",
                zIndex: "100",
              }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setMessageOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {message}
            </Alert>
          </Collapse>
        </Box>
      )}

      <TransitionsModal open={open} setOpen={setOpen} />
      <RecordModal open={openRecord} setOpen={setOpenRecord} />
    </div>
  );
};
