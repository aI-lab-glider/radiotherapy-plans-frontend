import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  SplineSeries,
} from "@devexpress/dx-react-chart-material-ui";

const generateData = (start: number, end: number, step: number) => {
  const data = [];
  for (let i = start; i < end; i += step) {
    data.push({
      splineValue: Math.sin(i) / i,
      lineValue: (i / 15) ** 2.718 - 0.2,
      argument: i,
    });
  }
  return data;
};

function DVH() {
  const data = generateData(2.5, 12, 0.5);

  return (
    <Paper
      style={{
        width: 1200,
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: 20,
      }}
    >
      <Chart data={data} width={1200} height={800}>
        <ArgumentAxis />
        <ValueAxis />

        <LineSeries
          name="line"
          valueField="lineValue"
          argumentField="argument"
        />
        <SplineSeries
          name="spline"
          valueField="splineValue"
          argumentField="argument"
        />
      </Chart>
    </Paper>
  );
}

export default DVH;
