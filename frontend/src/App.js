import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import SelectSmall from "./Components/units_dropdown";
import TextField from "@mui/material/TextField";

function App() {
  const REACT_API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL;
  // States
  const [InitialAction, setInitialAction] = useState(null);
  // 25 broad categories to initially choose from
  const [foodCategories, setFoodCategories] = useState(null);

  const [foodsInCategory, setFoodsInCategory] = useState(null);
  const [FoodTypes, setFoodTypes] = useState(null);
  // Values picked in submission
  const [ChosenCategory, setChosenCategory] = useState(null);
  const [ChosenFood, setChosenFood] = useState(null);
  const [ChosenFoodType, setChosenFoodType] = useState(null);

  const [MealsList, setMealsList] = useState([]);
  const [MealName, setMealName] = useState(null);
  const [MealIngrediants, setMealIngrediants] = useState([]);
  const [ServingSize, setServingSize] = useState(null);
  const [Unit, setUnit] = useState("");

  const api_call = async () => {
    const response = await axios.get(`${REACT_API_SERVER_URL}/food_categories`);
    setFoodCategories(response.data);
  };

  const getFoodsInCategory = async (category, id) => {
    setChosenCategory(id);
    const response = await axios.get(
      `${REACT_API_SERVER_URL}/foods_in_category/${category}`
    );
    setFoodsInCategory(response.data);
  };

  const AddToMeal = async (category, food, foodType, servingSize, unit) => {
    setMealIngrediants([
      ...MealIngrediants,
      {
        category: category,
        food: food,
        foodType: foodType,
        servingSize: servingSize,
        unit: unit,
      },
    ]);
  };

  // useEffects
  useEffect(() => {
    api_call();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Nutrition App</p>
      </header>

      <div>
        <div>
          <div>
            <p>Food Categories</p>
          </div>
          <div>
            {foodCategories &&
              foodCategories.map((foodCategory) => (
                <Button
                  variant="contained"
                  sx={{ m: 1 }}
                  key={foodCategory.id}
                  onClick={() => {
                    getFoodsInCategory(foodCategory.FdGrp_Cd, foodCategory._id);
                    setChosenFood(null);
                    setChosenFoodType(null);
                    setFoodTypes(null);
                    setFoodsInCategory(null);
                  }}
                >
                  {foodCategory._id}
                </Button>
              ))}
          </div>
          <div hidden={!ChosenCategory}>
            <p>Chosen Category: {ChosenCategory}</p>
            {foodsInCategory &&
              foodsInCategory.map((food) => (
                <Button
                  variant="contained"
                  sx={{ m: 1 }}
                  key={food.id}
                  onClick={() => {
                    setChosenFood(food._id);
                    setFoodTypes(food.types);
                  }}
                >
                  {food._id}
                </Button>
              ))}
          </div>
          <div hidden={!ChosenCategory}>
            <p>Chosen Food: {ChosenFood}</p>
            {FoodTypes &&
              FoodTypes.map((type) => (
                <Button
                  variant="contained"
                  sx={{ m: 1 }}
                  key={type.id}
                  onClick={() => {
                    setChosenFoodType(type);
                  }}
                >
                  {type}
                </Button>
              ))}
          </div>
        </div>
        <div hidden={!ChosenFoodType} style={{ marginTop: "100px" }}>
          <p>Food Details</p>
          <div>
            <p>Category: {ChosenCategory}</p>
            <p>Food Name: {ChosenFood}</p>
            <p>Food Type: {ChosenFoodType}</p>
          </div>
        </div>

        <div hidden={!ChosenFoodType}>
          <p>Serving Size</p>
          <div
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Amount"
              variant="outlined"
              onChange={(e) => setServingSize(e.target.value)}
            />

            <p>Unit: </p>
            <SelectSmall unit={Unit} setUnit={setUnit} />
          </div>
          <Button
            variant="contained"
            sx={{ m: 1 }}
            onClick={() => {
              AddToMeal(
                ChosenCategory,
                ChosenFood,
                ChosenFoodType,
                ServingSize,
                Unit
              );
            }}
          >
            Add to Meal
          </Button>
        </div>

        <div hidden={MealIngrediants.length === 0}>
          <p>Meal</p>
          <div>
            <table style={{ width: "100%" }}>
              <tr>
                <th>Category</th>
                <th>Food</th>
                <th>Food Type</th>
                <th>Serving Size</th>
                <th>Unit</th>
                <th>Remove</th>
              </tr>
              {MealIngrediants.map((meal) => (
                <tr>
                  <td>{meal.category}</td>
                  <td>{meal.food}</td>
                  <td>{meal.foodType}</td>
                  <td>{meal.servingSize}</td>
                  <td>{meal.unit}</td>
                  <td>
                    <Button
                      variant="contained"
                      sx={{ m: 1 }}
                      onClick={() => {
                        setMealIngrediants(
                          MealIngrediants.filter(
                            (item) => item.food !== meal.food
                          )
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </table>
          </div>

          <div hidden={MealIngrediants.length === 0}>
            <Button
              variant="contained"
              onClick={() => {
                setMealIngrediants([]);
              }}
            >
              Clear Meal
            </Button>
            <TextField
              required
              label="Meal Name"
              variant="outlined"
              style={{ margin: "10px" }}
              onChange={(e) => setMealName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                const meal = {
                  MealName: MealName,
                  MealIngrediants: MealIngrediants,
                };
                setMealsList([...MealsList, meal]);
                setMealIngrediants([]);
                setMealName(null);
                setChosenCategory(null);
                setChosenFood(null);
                setChosenFoodType(null);
                setFoodTypes(null);
                setFoodsInCategory(null);
              }}
            >
              Log Meal
            </Button>
          </div>
        </div>
        <div hidden={MealsList.length === 0}>
          <h2>Meal List</h2>
          <ul style={{ listStyleType: "none" }}>
            {MealsList.map((meal) => (
              <li style={{ border: "1px solid black", margin: "10px" }}>
                <p>Meal Name: {meal.MealName}</p>
                <p>Meal Ingrediants: </p>
                <table
                  style={{
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "auto",
                  }}
                >
                  <tr>
                    <th>Category</th>
                    <th>Food</th>
                    <th>Food Type</th>
                    <th>Serving Size</th>
                    <th>Unit</th>
                  </tr>
                  {meal.MealIngrediants.map((ingrediant) => (
                    <tr>
                      <td>{ingrediant.category}</td>
                      <td>{ingrediant.food}</td>
                      <td>{ingrediant.foodType}</td>
                      <td>{ingrediant.servingSize}</td>
                      <td>{ingrediant.unit}</td>
                    </tr>
                  ))}
                </table>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
