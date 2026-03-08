import { useColors } from "@/components/General/(Color Manager)/useColors";
import { WebsiteNavbar } from "@/components/General/WebsiteNavbar";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import SideSection from "./SideSection";
import TopSection from "./TopSection";
import BottomSection from "./BottomSection";

interface fnHandler {
  username: string;
}

function AnyUserV1(props: fnHandler) {
  const [data, setData] = useState();
  const [userExperiences, setUserExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [graphData, setGraphData] = useState([0, 0, 0, 0, 0]);
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/v1/users/profile/" + props.username,
      );
      if (!res) throw new Error("Unable to get Data");

      const result = res.data;

      console.log(result);
      setData(result.data);
      setUserExperiences(result.data.userExperiences || []);
      setProjects(result.data.projects || []);
      setGraphData(result.data.developerGraphs[0]);
    } catch (err) {
      console.error(err);
    }
  };
  const Colors = useColors();
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div
      className={`
          ${Colors.background.primary}
          h-screen
          overflow-hidden
          grid
          grid-cols-1
          lg:grid-cols-4
          gap-4
          p-3
          md:p-4
        `}
    >
      <WebsiteNavbar />
      {/* LEFT SECTION*/}
      <div className="lg:col-span-1 h-full rounded-xl overflow-y-auto scrollbar-hide">
        <SideSection data={data} />
      </div>

      {/* RIGHT SECTION*/}
      <div
        className={`
            ${Colors.background.secondary}
            lg:col-span-3
            h-full
            rounded-xl
            flex
            flex-col
            overflow-y-auto
            scrollbar-hide
          `}
      >
        <TopSection graphData={graphData} data={data} />
        <BottomSection project={projects} experience={userExperiences} />
      </div>
    </div>
  );
}

export default AnyUserV1;
