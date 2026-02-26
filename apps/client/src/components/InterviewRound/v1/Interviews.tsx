import { useColors } from "@/components/General/(Color Manager)/useColors";
import React from "react";

function Interviews({ data }: { data: any }) {
  const colors = useColors();
  return <div className={`${colors.text.primary}`}>{JSON.stringify(data)}</div>;
}

export default Interviews;
