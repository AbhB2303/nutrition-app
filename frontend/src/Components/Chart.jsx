import React from "react";
import { Chart } from "react-google-charts";

export const Custom_Chart = ({ data, graphType, options, message }) => {
  return (
    <div hidden={data.length <= 1}>
      <div>
        <Chart
          chartType={graphType}
          data={data}
          options={options}
          height={"50vh"}
        />
      </div>
    </div>
  );
};
