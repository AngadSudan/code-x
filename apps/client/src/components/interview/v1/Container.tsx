import { useColors } from "@/components/General/(Color Manager)/useColors";
import { useEffect, useState } from "react";
import CustomEditor from "./CustomEditor";

interface fnHandler {
  containerURL: string;
  isHost: boolean;
  fileSystem?: Object;
  openFile?: string[];
  socket?: any;
}

export default function Container(prop: fnHandler) {
  const colors = useColors();

  return (
    <div className="h-[90svh] w-full p-6 flex justify-center items-center">
      <div
        className={`h-full w-full rounded-3xl ${colors.background.secondary} ${colors.border.fadedThin}`}
      >
        {prop.isHost ? (
          <CustomEditor
            fileSystem={prop.fileSystem ?? {}}
            openFile={prop.openFile ?? []}
            socket={prop.socket ?? null}
          />
        ) : (
          <iframe className="h-full w-full" src={prop.containerURL}></iframe>
        )}
      </div>
    </div>
  );
}
