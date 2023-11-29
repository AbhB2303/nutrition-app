import React from "react";
import { Chart } from "react-google-charts";

export const TestChart = () => {
  const data = [
    ["Date", "Protein", "Total Lipid (Fat)", "Carbs", "Sugar", "Fiber"],
    ["Nov 1", 800, 200, 400, 80, 30],
    ["Nov 2", 1200, 350, 150, 120, 20],
    ["Nov 3", 600, 900, 250, 60, 40],
    ["Nov 4", 950, 600, 300, 150, 35],
    ["Nov 5", 1100, 300, 180, 80, 25],
    ["Nov 6", 1300, 400, 200, 110, 45],
    ["Nov 7", 700, 800, 280, 70, 30],
    ["Nov 8", 1000, 500, 320, 120, 50],
    ["Nov 9", 850, 250, 420, 90, 15],
    ["Nov 10", 1150, 350, 180, 100, 40],
    ["Nov 11", 750, 950, 240, 50, 20],
    ["Nov 12", 900, 700, 370, 130, 30],
    ["Nov 13", 950, 300, 160, 70, 20],
    ["Nov 14", 1100, 400, 190, 90, 25],
    ["Nov 15", 780, 850, 300, 110, 35],
    ["Nov 16", 1050, 600, 260, 120, 40],
    ["Nov 17", 820, 200, 400, 80, 30],
    ["Nov 18", 1230, 450, 140, 130, 15],
    ["Nov 19", 690, 850, 220, 60, 50],
    ["Nov 20", 950, 700, 380, 140, 30],
    ["Nov 21", 900, 250, 200, 70, 45],
    ["Nov 22", 1150, 400, 250, 110, 20],
    ["Nov 23", 750, 950, 180, 50, 35],
    ["Nov 24", 880, 600, 320, 100, 25],
  ];

  const options = {
    title: "Nutritional Value Of All Meals Over Time",
    hAxis: { title: "Date", minValue: 0, maxValue: 2022 },
    vAxis: { title: "Nutritional Value", minValue: 0, maxValue: 1500 },
  };

  return (
    <div>
      <Chart
        chartType="LineChart"
        data={data}
        options={options}
        height="300px"
        width="680px"
      />
    </div>
  );
};
