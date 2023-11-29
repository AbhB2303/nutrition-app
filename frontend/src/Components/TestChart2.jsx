import React from "react";
import { Chart } from "react-google-charts";

export const TestChart2 = () => {
  const data = [
    ["Value", "Protein", "Total Lipid (Fat)", "Carbs", "Sugar", "Fiber"],
    ["Egg and Cheese", 1000, 400, 200, 110, 45],
    ["Chicken and Rice", 800, 200, 400, 80, 30],
  ];

  const options = {
    title: "Nutritional Value Of a Meal",
    vAxis: { title: "Meal", minValue: 0, maxValue: 2022 },
    hAxis: { title: "Value", minValue: 0, maxValue: 1500 },
  };

  return (
    <div>
      <Chart
        chartType="BarChart"
        data={data}
        options={options}
        height="300px"
        width="680px"
      />
    </div>
  );
};
