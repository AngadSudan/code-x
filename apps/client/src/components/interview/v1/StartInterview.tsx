import { InterviewInfo, InterviewMember } from "@/utils/type";
import InterviewConformation from "./InterviewConformation";
import { useRef, useState } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import InterviewCall from "./InterviewCall";
import { Socket } from "socket.io-client";

function StartInterview(data: InterviewMember) {
  const theme = useColors();
  const [confirmed, setConfirmed] = useState(false);
  const [interviewData, setInterviewData] = useState<InterviewInfo | null>(
    null,
  );
  const socketRef = useRef<Socket | null>(null);
  return (
    <div className={`${theme.background.primary}`}>
      {!confirmed ? (
        <InterviewConformation
          interviewId={data.param.id}
          isHost={data.isHost}
          interviewData={setInterviewData}
          setConfirmed={setConfirmed}
          socket={socketRef}
        />
      ) : (
        <InterviewCall
          appId={interviewData?.appId || ""}
          channelName={data.param.id}
          token={interviewData?.token || ""}
          uid={interviewData?.uid || ""}
          containerUrl={interviewData?.containerUrl || ""}
          socket={socketRef}
          isHost={data.isHost}
        />
      )}
    </div>
  );
}

export default StartInterview;
