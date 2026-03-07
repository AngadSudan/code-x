"use client";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { RemoteUser, useRemoteUsers } from "agora-rtc-react";
import { useEffect, useMemo, useRef } from "react";

interface fnHandler {
  videoStream: any;
}

function CustomEditor(prop: fnHandler) {
  const colors = useColors();
  const videoRef = useRef<HTMLDivElement | null>(null);
  const remoteUsers = useRemoteUsers();

  if (remoteUsers.length === 0) {
    return (
      <div
        className={`
          h-full w-full flex items-center justify-center
          ${colors.background.secondary}
          ${colors.text.secondary}
          ${colors.border.fadedThin}
          rounded-md
        `}
      >
        Waiting for candidate to stream their screen. Make sure they are sharing
        their entire screen.
      </div>
    );
  }

  return (
    <div
      className={`
        h-full w-full relative overflow-hidden
        ${colors.background.primary}
        ${colors.border.defaultThin}
        rounded-md
      `}
    >
      <RemoteUser user={remoteUsers[0]} />
      {/* <div ref={videoRef} className="h-full w-full [&>video]:object-contain" /> */}
    </div>
  );
}

export default CustomEditor;
