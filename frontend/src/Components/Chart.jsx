import React from "react";
import { Chart } from "react-google-charts";

export const Custom_Chart = ({ data, graphType, options, message }) => {
  return (
    <div>
      <div hidden={data.length <= 1}>
        <Chart
          chartType={graphType}
          data={data}
          options={options}
          height={"50vh"}
        />
      </div>
      <div hidden={data.length > 1}>
        <p style={{marginTop: "50%", textAlign: "center"}}>Select a meal to view the chart.</p>
      </div>
    </div>
  );
};
