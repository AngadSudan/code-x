"use client";

import { useColors } from "@/components/General/(Color Manager)/useColors";
import axiosInstance from "@/utils/axiosInstance";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export default function RadarChart() {
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
        angleLines: {
          color: `${colors.secondary}`,
        },
        grid: {
          color: `${colors.secondary}`,
        },
        pointLabels: {
          color: `${colors.primary}`,
          font: {
            size: 14,
            family: "monospace",
          },
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
      legend: {
        display: false,
      },
    },
  };
  const Colors = useColors();
  const [isGitConnected, setIsGitConnected] = useState(false);
  const [graphData, setGraphData] = useState([0, 0, 0, 0, 0]);
  const [graphFormat, setGraphFormat] = useState({
    labels: ["System Design", "Backend", "Frontend", "Cloud", "DevOps"],
    datasets: [
      {
        label: "Skill Level",
        data: graphData,
        fill: true,
        backgroundColor: `${colors.internalFaded}`,
        borderColor: `${colors.primary}`,
        pointBackgroundColor: `${colors.primary}`,
        pointBorderColor: `${colors.primary}`,
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  });

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/users/git-graph");
      const data = res.data;

      console.log("git graph data is ");
      console.log(data.data);
      setIsGitConnected(data.data.isConnected);
      setGraphData(data.data.graphPoints);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(graphData);
    setGraphFormat({
      labels: ["System Design", "Backend", "Frontend", "Cloud", "DevOps"],
      datasets: [
        {
          label: "Skill Level",
          data: graphData,
          fill: true,
          backgroundColor: `${colors.internalFaded}`,
          borderColor: `${colors.primary}`,
          pointBackgroundColor: `${colors.primary}`,
          pointBorderColor: `${colors.primary}`,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    });
  }, [graphData]);
  useEffect(() => {
    fetchData();
  }, []);
  return isGitConnected ? (
    <Radar data={graphFormat} options={options} />
  ) : (
    <div className="flex justify-center items-center h-full w-full">
      <Link
        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/github`}
        className={`flex gap-3 cursor-pointer p-2 ${Colors.background.special} ${Colors.text.inverted}`}
      >
        <Github />
        Connect to Github
      </Link>
    </div>
  );
}
