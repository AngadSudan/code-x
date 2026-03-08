import React, { useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);
function RadarChart({ graphData }: { graphData: number[] }) {
  const colors = {
    priBG: "#121313",
    secBG: "#1E1E1E",
    primary: "#6BFBBF",
    secondary: "#129274",
    externalFaded: "rgba(18, 146, 116, 0.24)",
    internalFaded: "rgba(107, 251, 192, 0.56)",
    white: "#FFFFFF",
    offWhite: "#B1AAA6",
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: colors.secondary },
        grid: { color: colors.secondary },
        pointLabels: {
          color: colors.primary,
          font: { size: 14, family: "monospace" },
        },
        ticks: {
          display: false,
          stepSize: 20,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const graphFormat = {
    labels: ["System Design", "Backend", "Frontend", "Cloud", "DevOps"],
    datasets: [
      {
        label: "Skill Level",
        data: graphData,
        fill: true,
        backgroundColor: colors.internalFaded,
        borderColor: colors.primary,
        pointBackgroundColor: colors.primary,
        pointBorderColor: colors.primary,
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  };

  return <Radar data={graphFormat} options={options} />;
}
export default RadarChart;
