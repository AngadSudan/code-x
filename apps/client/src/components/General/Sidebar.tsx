import React from "react";
import { useColors } from "./(Color Manager)/useColors";

function Sidebar() {
  const theme = useColors();
  return (
    <div
      className={`w-1/5 h-screen rounded-md ${theme.background.primary} ${theme.border.defaultThin}`}
    >
      Sidebar
    </div>
  );
}

export default Sidebar;
