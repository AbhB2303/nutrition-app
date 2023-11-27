import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SelectSmall from "../units_dropdown";
import Typography from "@mui/material/Typography";

export const ManualCreateComponent = () => {
  const REACT_API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL;

  // 25 broad categories to initially choose from
  const [foodCategories, setFoodCategories] = useState(null);

  const [foodsInCategory, setFoodsInCategory] = useState(null);
  const [FoodTypes, setFoodTypes] = useState(null);

  // Values picked in submission
  const [ChosenCategory, setChosenCategory] = useState(null);
  const [ChosenFood, setChosenFood] = useState(null);
  const [ChosenFoodType, setChosenFoodType] = useState(null);

  const [MealName, setMealName] = useState(null);
  const [MealIngredients, setMealIngredients] = useState([]);
  const [ServingSize, setServingSize] = useState(null);
  const [Unit, setUnit] = useState("");
  const [NameIsSet, setNameIsSet] = useState(false);

  // states of input
  const [InputFormCompleted, setInputFormCompleted] = useState(false);
  const [IngrediantAdded, setIngrediantAdded] = useState(false);

  const createMealRecord = async (meal) => {
    // const response = await axios.post(`${REACT_API_SERVER_URL}/meals`, meal);
    // console.log(response);
    console.log(meal);
  };

  const getFoodsInCategory = async (category, id) => {
    setChosenCategory(id);
    const response = await axios.get(
      `${REACT_API_SERVER_URL}/foods/${category}`
    );
    setFoodsInCategory(response.data);
  };

  const get_food_categories = async () => {
    const response = await axios.get(`${REACT_API_SERVER_URL}/food_categories`);
    setFoodCategories(response.data);
  };

  const AddToMeal = async (category, food, foodType, servingSize, unit) => {
    setMealIngredients([
      ...MealIngredients,
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
    get_food_categories();
  }, []);

  const ResetMeal = (ResetEntireMeal = true) => {
    setIngrediantAdded(false);
    setChosenFoodType(null);
    setServingSize(null);
    setUnit(null);
    setFoodTypes(null);
    setFoodsInCategory(null);
    setChosenFood(null);
    setChosenCategory(null);
    setInputFormCompleted(false);
    if (ResetEntireMeal) {
      setMealIngredients([]);
      setNameIsSet(false);
      setMealName(null);
    }
  };

  return (
    <div>
      <div>
        <div style={{ textAlign: "center" }} hidden={NameIsSet}>
          <Typography variant="h6" component="h2">
            Let's start off by giving this meal a name:
          </Typography>
          <TextField
            required
            label="Meal Name"
            onChange={(e) => setMealName(e.target.value)}
          />
          <Button
            style={{ "margin-top": "10px" }}
            onClick={() => {
              setNameIsSet(true);
            }}
          >
            Done
          </Button>
        </div>
        <div hidden={(InputFormCompleted && IngrediantAdded) || !NameIsSet}>
          <Typography
            variant="h6"
            component="h2"
            hidden={ChosenFoodType !== null}
          >
            Now let's start adding some ingredients to {MealName}:
          </Typography>
        </div>
        <div hidden={!NameIsSet || ChosenCategory}>
          <p hidden={InputFormCompleted}>Food Categories</p>
          {foodCategories &&
            foodCategories.map((foodCategory) => (
              <Button
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
        <p hidden={InputFormCompleted || ChosenCategory == null}>
          Chosen Category: {ChosenCategory}
        </p>
        <div hidden={!ChosenCategory || ChosenFood}>
          {foodsInCategory &&
            foodsInCategory.map((food) => (
              <Button
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
        <p hidden={InputFormCompleted || ChosenCategory == null}>
          Chosen Food: {ChosenFood}
        </p>
        <div hidden={!ChosenCategory || ChosenFoodType}>
          {FoodTypes &&
            FoodTypes.map((type) => (
              <Button
                key={type.id}
                onClick={() => {
                  setChosenFoodType(type);
                  setInputFormCompleted(true);
                }}
              >
                {type}
              </Button>
            ))}
        </div>
      </div>
      {ChosenFoodType !== null &&
        InputFormCompleted &&
        IngrediantAdded === false && (
          <div
            style={{
              gap: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>Confirm Ingredient Details:</p>
            <div>
              <p>Category: {ChosenCategory}</p>
              <p>Food Name: {ChosenFood}</p>
              <p>Food Type: {ChosenFoodType}</p>
            </div>
            <div>
              <TextField
                id="outlined-basic"
                label="Amount"
                onChange={(e) => setServingSize(e.target.value)}
              />
              <div>
                <SelectSmall unit={Unit} setUnit={setUnit} />
              </div>
            </div>
            <Button
              onClick={() => {
                AddToMeal(
                  ChosenCategory,
                  ChosenFood,
                  ChosenFoodType,
                  ServingSize,
                  Unit
                );
                setIngrediantAdded(true);
              }}
            >
              Add to Meal
            </Button>
          </div>
        )}
      <div hidden={!NameIsSet}>
        <p>Meal Name: {MealName}</p>
        {(MealIngredients.length > 0 && (
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
              {MealIngredients.map((meal) => (
                <tr>
                  <td>{meal.category}</td>
                  <td>{meal.food}</td>
                  <td>{meal.foodType}</td>
                  <td>{meal.servingSize}</td>
                  <td>{meal.unit}</td>
                  <td>
                    <Button
                      onClick={() => {
                        setMealIngredients(
                          MealIngredients.filter(
                            (item) => item.food !== meal.food
                          )
                        );
                        if (MealIngredients.length === 1) {
                          ResetMeal();
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        )) || (
          <p>
            No ingredients added yet. When you add one, you will see your meal
            recipe build here.
          </p>
        )}

        <div hidden={MealIngredients.length === 0 || !ChosenFoodType}>
          <Button
            onClick={() => {
              ResetMeal(false);
            }}
          >
            Add Another Ingrediant
          </Button>
          <Button
            onClick={() => {
              ResetMeal();
            }}
          >
            Clear All Ingredients
          </Button>
          <div hidden={IngrediantAdded === false}>
            <Button
              variant="secondary"
              onClick={() => {
                const meal = {
                  MealName: MealName,
                  MealIngredients: MealIngredients,
                };
                createMealRecord(meal);
                ResetMeal();
              }}
            >
              Finish Building Meal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
