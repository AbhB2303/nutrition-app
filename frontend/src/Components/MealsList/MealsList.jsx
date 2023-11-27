import React from "react";

export const MealsList = ({ ListOfMeals }) => {
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          fontSize: "20px",
        }}
      >
        Meals List
      </h1>
      {ListOfMeals ? (
        ListOfMeals.map((meal) => (
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
        ))
      ) : (
        <p style={{ margin: "20px" }}>
          You don't have any saved meals yet. Click on the "Create a new meal"
          button to get started!
        </p>
      )}
    </div>
  );
};

export default MealsList;
