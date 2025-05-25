"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
} from "recharts";

interface ChartDataItem {
  name: string | number;
  value: number;
  [key: string]: any;
}

interface ChartWidgetProps {
  data: {
    chartType: "bar" | "line" | "pie" | "scatter" | "area";
    dataset: number[] | { x: number; y: number }[];
    title?: string;
    labels?: string[];
  };
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF19A8",
];

const ChartWidget: React.FC<ChartWidgetProps> = ({ data }) => {
  const { chartType, dataset, title, labels } = data;

  let chartData: ChartDataItem[] = [];

  if (chartType === "scatter") {
    chartData = (dataset as { x: number; y: number }[]).map((item, index) => ({
      name: `Point ${index + 1}`,
      xValue: item.x,
      yValue: item.y,
      value: item.y,
    }));
  } else {
    chartData = (dataset as number[]).map((value, index) => ({
      name: labels?.[index] || `Item ${index + 1}`,
      value: value,
    }));
  }

  if (!dataset || dataset.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-md p-4">
        No data available for this chart.
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case "scatter":
        return (
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="xValue" name="X-Axis" />
            <YAxis type="number" dataKey="yValue" name="Y-Axis" />
            <ZAxis
              dataKey="zValue"
              range={[60, 400]}
              name="Z-Axis (Optional)"
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter
              name={title || "Data Points"}
              data={chartData}
              fill="#8884d8"
            />
          </ScatterChart>
        );

      case "area":
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        );

      default:
        return <div>No chart type selected</div>;
    }
  };

  return (
    <div className="h-full w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWidget;
