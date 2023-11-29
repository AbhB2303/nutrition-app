import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";

export const MealsList = ({ ListOfMeals }) => {
  const { user, isAuthenticated } = useAuth0();

  const getNutritionInfo = async (mealName) => {
    const response = await axios
      .get(
        `${process.env.REACT_APP_API_SERVER_URL}/get_meal_nutrients/${user.email}/${mealName}`
      )
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <div style={{ textAlign: "center", margin: "auto" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "20px",
        }}
      >
        Recent Meals
      </h1>
      {ListOfMeals ? (
        ListOfMeals.map((meal) => (
          <Button
            style={{ fontWeight: "bold", margin: "10px" }}
            onClick={() => {
              getNutritionInfo(meal._id);
            }}
          >
            {meal.MealName}
          </Button>
          /* <p>Meal Ingrediants: </p>
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
              {meal.MealIngredients.map((ingredient) => (
                <tr>
                  <td>{ingredient.category}</td>
                  <td>{ingredient.food}</td>
                  <td>{ingredient.foodType}</td>
                  <td>{ingredient.servingSize}</td>
                  <td>{ingredient.unit}</td>
                </tr>
              ))}
            </table> */
        ))
      ) : (
        <p style={{ marginLeft: "20px" }}>
          You don't have any saved meals yet. Click on the "Create a new meal"
          button to get started!
        </p>
      )}
    </div>
  );
};

export default MealsList;
