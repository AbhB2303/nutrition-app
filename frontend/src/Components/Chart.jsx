import React from "react";
import { Chart } from "react-google-charts";

export const Custom_Chart = ({ data, graphType, options }) => {
  return (
    <div>
      <div hidden={data.length === 0}>
        <Chart
          chartType={graphType}
          data={data}
          options={options}
          height={"50vh"}
          // width={"45vw"}
        />
      </div>
      {/* <div
        hidden={data.length !== 0}
        style={{
          textAlign: "center",
          width: "45vw",
          height: "45vh",
          margin: "auto",
        }}
      >
        <h2>No Data</h2>
        <p>
          Select a meal in the 'Configure Meals Chart' section to view data.
        </p>
        <p>
          {" "}
          Don't have any meals added yet? Add one at the top right by clicking
          'Create A New Meal'.
        </p>
      </div> */}
    </div>
  );
};
