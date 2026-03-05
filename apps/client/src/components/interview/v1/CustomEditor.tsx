import { useColors } from "@/components/General/(Color Manager)/useColors";
import { useEffect, useRef } from "react";

interface fnHandler {
  videoStream: any;
}

function CustomEditor(prop: fnHandler) {
  const colors = useColors();
  const videoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prop.videoStream && videoRef.current) {
      prop.videoStream.play(videoRef.current);

      return () => {
        prop.videoStream.stop();
      };
    }
  }, [prop.videoStream]);

  if (!prop.videoStream) {
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
      <div ref={videoRef} className="h-full w-full [&>video]:object-contain" />
    </div>
  );
}

export default CustomEditor;
