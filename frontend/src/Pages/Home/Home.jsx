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

export const Home = () => {
  const [open, setOpen] = useState(false);
  const [listOfMeals, setListOfMeals] = useState(null);
  const [mealForGraph2, setMealForGraph2] = useState("");
  const [recordedMeals, setRecordedMeals] = useState([]); // [mealName, mealNutritionInfo]
  const [timePeriod, setTimePeriod] = useState("");
  const { user } = useAuth0();
  const [openRecord, setOpenRecord] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [barChartData, setBarchartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [loadChartData, setLoadChartData] = useState(false);

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

  const getIngredientNutritionInfo = (mealInfo, chartType, date) => {
    const ingredients = mealInfo.map((meal) => meal[0]);
    console.log(ingredients);
    console.log(mealInfo);
    const header_array = ["Quantity (grams)"];
    const data_array = ["Test"];
    if (chartType === "LineChart" && date) {
      data_array[0] = date;
    }
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient_data = ingredients[i]["nutrient_info"];
      console.log(ingredient_data);
      for (let j = 0; j < ingredient_data.length; j++) {
        if (
          ingredient_data[j]["Label"] === "Protein" ||
          ingredient_data[j]["Label"] === "Total lipid (fat)" ||
          ingredient_data[j]["Label"] === "Carbohydrate, by difference" ||
          ingredient_data[j]["Label"] === "Fiber, total dietary" ||
          ingredient_data[j]["Label"] === "Sugars, total"
        ) {
          if (!header_array.includes(ingredient_data[j]["Label"])) {
            header_array.push(ingredient_data[j]["Label"]);
            data_array.push(ingredient_data[j]["Total"]);
          }

          const index_of_val = header_array.indexOf(
            ingredient_data[j]["Label"]
          );

          data_array[index_of_val] =
            data_array[index_of_val] + ingredient_data[j]["Total"];
        }
      }
    }

    const ChartData = [header_array, data_array];
    if (chartType === "LineChart") {
      return ChartData;
    }
    if (chartType === "BarChart") {
      setBarchartData(ChartData);
    }
  };

  const getNutritionInfo = async (mealName) => {
    const response = await axios
      .get(
        `${process.env.REACT_APP_API_SERVER_URL}/get_meal_nutrients/${user.email}/${mealName}`
      )
      .then((res) => {
        // gets total nutrient info of given meal
        const mealInfo = res.data;
        // each value in response contains 2 dictionaries, the first contains the nutrient info for each ingredient of the meal
        getIngredientNutritionInfo(mealInfo, "BarChart");
      });
  };

  const setMealChartData = async (meal) => {
    const meal_index = listOfMeals.map((meal) => meal._id).indexOf(meal);
    console.log(meal_index);
    // sets value retrieved on state
    await getNutritionInfo(meal);
    // iterates through ingredients of requested meal and gets the nutrient info
  };

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
        setListOfMeals(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_SERVER_URL}/get_all_meal_with_nutrients/${user.email}`
      )
      .then((res) => {
        const table = res.data;
        setTableData(table);
        console.log(table);
      });
  }, []);

  // loads line chart data on button click
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_SERVER_URL}/get_recorded_meals/${user.email}`
      )
      .then(async (res) => {
        setRecordedMeals(res.data);
        console.log(recordedMeals);
        const TotalChartData = [];
        for (let i = 0; i < recordedMeals.length; i++) {
          const response = await axios
            .get(
              `${process.env.REACT_APP_API_SERVER_URL}/get_meal_nutrients/${user.email}/${recordedMeals[i]["meal_id"]}`
            )
            .then((res) => {
              // gets total nutrient info of given meal
              const mealInfo = res.data;
              console.log(mealInfo);
              // each value in response contains 2 dictionaries, the first contains the nutrient info for each ingredient of the
              const ChartData = getIngredientNutritionInfo(
                mealInfo,
                "LineChart",
                recordedMeals[i]["date"]
              );
              console.log(ChartData);
              if (i === 0) {
                TotalChartData.push(ChartData[0]);
              }
              TotalChartData.push(ChartData[1]);
            });
        }
        setLineChartData(TotalChartData);
        console.log(TotalChartData);
      });
  }, [loadChartData]);

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
            Record a new meal
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
            >
              <FormControl>
                <InputLabel
                  id="select-helper-label-line"
                  style={{ margin: "10px", width: "100px" }}
                >
                  Time Period
                </InputLabel>
                <Select
                  style={{ margin: "20px", width: "150px" }}
                  value={timePeriod}
                  InputLabel="select-helper-label-line"
                  onChange={(e) => {
                    setTimePeriod(e.target.value);
                  }}
                >
                  <MenuItem value={"day"}>Day</MenuItem>
                  <MenuItem value={"week"}>Week</MenuItem>
                  <MenuItem value={"month"}>Month</MenuItem>
                  <MenuItem value={"year"}>Year</MenuItem>
                </Select>
              </FormControl>
              <Button
                onClick={() => {
                  setLoadChartData(!loadChartData);
                }}
              >
                Submit
              </Button>
            </div>
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
      <div className="graph-options">
        <div className="recommendations-container">
          <h3 style={{ textAlign: "left" }}>Current Recommendations</h3>
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
        <div className="meals-saved-list">
          {listOfMeals && (
            <MealsList
              ListOfMeals={listOfMeals}
              setListOfMeals={setListOfMeals}
            />
          )}
        </div>
      </div>

      {tableData && (
        <table className="table">
          <thead>
            <tr
              style={{
                backgroundColor: "white",
                color: "black",
                fontWeight: "bold",
              }}
            >
              <th>Meal Name</th>
              <th>Protein</th>
              <th>Iron</th>
              <th>Energy</th>
              <th>Carbs</th>
            </tr>
          </thead>
          <tbody
            style={{
              overflowY: "scroll",
              height: "200px",
              border: "1px solid black",
              textAlign: "center",
            }}
            className="table-body"
          >
            {" "}
            {tableData.map((meal) => {
              return (
                <tr
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  <td>{meal.meal.MealName}</td>
                  <td>{meal.nutrients["Protein"]}</td>
                  <td>{meal.nutrients["Iron, Fe"]}</td>
                  <td>{meal.nutrients["Energy"]}</td>
                  <td>{meal.nutrients["Vitamin D"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <TransitionsModal open={open} setOpen={setOpen} />
      <RecordModal open={openRecord} setOpen={setOpenRecord} />
    </div>
  );
};
