"use client";

import React from "react";
import { useColors } from "./(Color Manager)/useColors";

interface SpinnerProps {
  size?: number;
  thickness?: number;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  thickness = 4,
  className = "",
}) => {
  const baseStyle = {
    width: size,
    height: size,
    borderWidth: thickness,
  };
  const Colors = useColors();

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
        <div
          style={baseStyle}
          className={`rounded-full ${Colors.border.specialThin} border-r-transparent animate-spin-slow`}
        />

    </div>
  );
};

export default Spinner;