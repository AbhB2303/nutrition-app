import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SelectSmall from "../units_dropdown";
import { useAuth0 } from "@auth0/auth0-react";
import Autocomplete from "@mui/material/Autocomplete";

export const ManualCreateComponent = ({ setOpen }) => {
  const REACT_API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL;

  // dropdown values
  const [foodCategories, setFoodCategories] = useState(null);
  const [foodsInCategory, setFoodsInCategory] = useState(null);
  const [FoodTypes, setFoodTypes] = useState(null);
  const [ServingSizes, setServingSizes] = useState(null);
  // Values picked in submission
  const [ChosenCategory, setChosenCategory] = useState(null);
  const [ChosenFood, setChosenFood] = useState(null);
  const [ChosenFoodType, setChosenFoodType] = useState(null);
  const [MealName, setMealName] = useState(null);
  const [MealIngredients, setMealIngredients] = useState([]);
  const [ServingSize, setServingSize] = useState(null);
  const [Unit, setUnit] = useState("");
  const [UnitName, setUnitName] = useState(null);

  // states of input
  const [InputFormCompleted, setInputFormCompleted] = useState(false);

  const { user, isAuthenticated } = useAuth0();

  const createMealRecord = async (meal) => {
    if (!meal) return;

    const formData = new FormData();
    formData.append("MealName", meal.MealName);

    const mealIngredients = [];
    for (const ingredient of meal.MealIngredients) {
      mealIngredients.push({
        category: ingredient.category,
        Long_Desc: ingredient.food + "," + ingredient.foodType,
        serving_size: ingredient.servingSize,
        weight_in_grams: ingredient.unit,
        unit_name: ingredient.unitName,
      });
    }

    formData.append("MealIngredients", JSON.stringify(mealIngredients));

    if (isAuthenticated) {
      await axios.post(
        `${REACT_API_SERVER_URL}/save_meal/${user.email}`,
        formData
      ).then(
        window.location.reload()
      )
      setOpen(false);    }
  };

  const getFoodsInCategory = async (category, id) => {
    setChosenCategory(id);
    await axios.get(`${REACT_API_SERVER_URL}/foods/${category}`).then((res) => {
      setFoodsInCategory(res.data);
    });
  };

  const get_food_categories = async () => {
    await axios.get(`${REACT_API_SERVER_URL}/food_categories`).then((res) => {
      setFoodCategories(res.data.map((item) => [item._id, item.FdGrp_Cd]));
    });
  };

  const get_serving_size = async (food, foodType) => {
    const foodname = food + "," + foodType;
    const formData = new FormData();
    formData.append("item_name", foodname);
    await axios
      .post(`${REACT_API_SERVER_URL}/serving_size/`, formData)
      .then((res) => {
        setServingSizes(res.data);
      });
  };

  const AddToMeal = async (
    category,
    food,
    foodType,
    servingSize,
    unit,
    unitName
  ) => {
    setMealIngredients([
      ...MealIngredients,
      {
        category: category,
        food: food,
        foodType: foodType,
        servingSize: servingSize,
        unit: unit,
        unitName: unitName,
      },
    ]);
  };

  // useEffects
  useEffect(() => {
    get_food_categories();
  }, []);

  useEffect(() => {
    if (ChosenFoodType !== null) {
      get_serving_size(ChosenFood, ChosenFoodType);
    }
  }, [ChosenFoodType]);

  const ResetMeal = (ResetEntireMeal = true) => {
    setChosenFoodType(null);
    setServingSize(null);
    setUnit(null);
    setFoodTypes(null);
    setFoodsInCategory(null);
    setChosenFood(null);
    setChosenCategory(null);
    setInputFormCompleted(false);
    setUnitName(null);

    if (ResetEntireMeal) {
      setMealIngredients([]);
      setMealName(null);
    }
  };

  return (
    <div
      style={{
        paddingBottom: "20px",
        paddingTop: "50px",
        paddingLeft: "10px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h3 style={{marginTop: "0", marginBottom: "0"}}>Enter the name of your meal</h3>
        <p style={{fontSize: "14px"}}>Eg. Pizza, Avocado toast</p>
        <div>
          <TextField
            required
            label="Meal Name"
            onChange={(e) => setMealName(e.target.value)}
            style={{ width: "50%" }}
          />
        </div>

        <h3 style={{marginBottom: "0"}}>Ingredients</h3>
        <p style={{fontSize: "14px", marginBottom: "0"}}>Repeat as many times to provide all ingredients.</p>
        <div
          style={{
            textAlign: "left",
            marginTop: "20px",
            gap: "20px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {foodCategories && (
            <Autocomplete
              disablePortal
              options={
                foodCategories ? foodCategories.map((item) => item[0]) : []
              }
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Food Categories" />
              )}
              onChange={(event, value) => {
                if (value === null) {
                  setChosenCategory(null);
                  setChosenFood(null);
                  setChosenFoodType(null);
                  setFoodsInCategory(null);
                  setFoodTypes(null);
                  setInputFormCompleted(false);
                  return;
                }
                const id = foodCategories.find((item) => item[0] === value)[1];
                getFoodsInCategory(id, value);
              }}
            />
          )}

          <Autocomplete
            disabled={foodsInCategory === null}
            disablePortal
            options={
              foodsInCategory ? foodsInCategory.map((item) => item._id) : []
            }
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Foods" />}
            onChange={(event, value) => {
              if (value === null) {
                setChosenFood(null);
                setFoodTypes(null);
                setInputFormCompleted(false);
                return;
              }
              setChosenFood(value);
              setFoodTypes(
                foodsInCategory.find((item) => item._id === value).types
              );
            }}
          />

          <Autocomplete
            options={FoodTypes ? FoodTypes : []}
            style={{ width: 300 }}
            disabled={FoodTypes === null}
            renderInput={(params) => (
              <TextField {...params} label="Food Types" />
            )}
            onChange={(event, value) => {
              if (value === null) {
                setChosenFoodType(null);
                setInputFormCompleted(false);
                return;
              }
              setChosenFoodType(value);
              setInputFormCompleted(true);
            }}
          />
        </div>
        <div
          style={{
            gap: "10px",
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          <div>
            <TextField
              id="outlined-basic"
              label="Serving Size"
              type="number"
              onChange={(e) => setServingSize(e.target.value)}
              disabled={!InputFormCompleted}
            />

            <SelectSmall
              setUnit={setUnit}
              options={ServingSizes ? ServingSizes : []}
              setUnitName={setUnitName}
              disabled={!InputFormCompleted}
            />
          </div>
          <Button
            style={{ marginTop: "10px", alignSelf: "left", width: "20%" }}
            variant="contained"
            onClick={() => {
              AddToMeal(
                ChosenCategory,
                ChosenFood,
                ChosenFoodType,
                ServingSize,
                Unit,
                UnitName
              );
            }}
            disabled={!InputFormCompleted}
          >
            Add to Meal
          </Button>
        </div>
      </div>

      {(MealIngredients.length > 0 && (
        <div>
          <table style={{ width: "100%", marginTop: "20px" }}>
            <tr>
              <th>Category</th>
              <th>Food</th>
              <th>Food Type</th>
              <th>Serving Size</th>
              <th>Units</th>
            </tr>
            {MealIngredients.map((meal) => (
              <tr style={{ textAlign: "center" }}>
                <td>{meal.category}</td>
                <td>{meal.food}</td>
                <td>{meal.foodType}</td>
                <td>{meal.servingSize}</td>
                <td>{meal.unitName}</td>
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

          <Button
            variant="contained"
            color="success"
            onClick={() => {
              const meal = {
                MealName: MealName,
                MealIngredients: MealIngredients,
              };
              createMealRecord(meal);
              ResetMeal();
            }}
            style={{ margin: "10px", marginTop: "20px", marginBottom: "20px" }}
          >
            Finish Building Meal
          </Button>

          <Button
            onClick={() => {
              ResetMeal();
            }}
            color="error"
          >
            Clear All Ingredients
          </Button>
        </div>
      )) || (
        <div>
          <p>
            No ingredients added yet. When you add one, you will see your meal
            recipe build here.
          </p>
        </div>
      )}
    </div>
  );
};
