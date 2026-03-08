"use client";

import React, { useEffect, useState } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import RadarChart from "./RadarChart";
import UserInfo from "./UserInfo";

interface fnHandler {
  graphData: any[];
  data: any;
}

function TopSection({ graphData, data }: fnHandler) {
  const Colors = useColors();
  const [graphObject, setGraphObject] = useState([0, 0, 0, 0, 0]);
  console.log("topsecton");
  console.log(graphData);
  useEffect(() => {
    if (!graphData) return;

    const obj = [
      //@ts-ignore
      graphData?.systemDesign || 0,
      //@ts-ignore
      graphData?.backend || 0,
      //@ts-ignore
      graphData?.frontend || 0,
      //@ts-ignore
      graphData?.tools || 0,
      //@ts-ignore
      graphData?.devops || 0,
    ];
    console.log("obj i");
    console.log(obj);
    setGraphObject(obj);
  }, [graphData]);
  return (
    <div
      className={`${Colors.background.secondary} rounded-xl gap-4 p-4 w-full h-fit grid grid-cols-1 xl:grid-cols-3`}
    >
      {/* Radar Chart */}
      {graphObject && graphObject.length > 0 && (
        <div className={`${Colors.background.primary} rounded-xl p-4 min-h-64`}>
          <RadarChart graphData={graphObject} />
        </div>
      )}

      {/* User Info */}
      <div
        className={`${Colors.background.primary} xl:col-span-2 rounded-xl p-4`}
      >
        <UserInfo data={data} />
      </div>
    </div>
  );
}

export default TopSection;
