import React from "react";
import SuiteCard from "./SuiteCard";
import { Suite } from "@/utils/type";

function DisplaySuites({ suites }: { suites: Suite[] }) {
  return (
    <div className="grid grid-cols-3 mt-4 overflow-auto">
      {suites.map((suite, index) => {
        return <SuiteCard key={index} info={suite} />;
      })}
    </div>
  );
}

export default DisplaySuites;
