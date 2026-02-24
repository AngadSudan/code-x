import { InterviewInfo, InterviewMember } from "@/utils/type";
import InterviewConformation from "./InterviewConformation";
import { useRef, useState } from "react";
import InterviewCall from "./InterviewCall";
import type { Socket } from "socket.io-client";
function JoinInterview(data: InterviewMember) {
  const [confirmed, setConfirmed] = useState(false);
  const [intervieweeData, setIntervieweeData] = useState<InterviewInfo | null>(
    null,
  );
  const socketRef = useRef<Socket | null>(null);
  return (
    <>
      {!confirmed ? (
        <InterviewConformation
          interviewId={data.param.id}
          isHost={data.isHost}
          interviewData={setIntervieweeData}
          setConfirmed={setConfirmed}
          socket={socketRef}
        />
      ) : (
        <InterviewCall
          appId={intervieweeData?.appId || ""}
          channelName={data.param.id}
          token={intervieweeData?.token || ""}
          uid={intervieweeData?.uid || ""}
          containerUrl={intervieweeData?.containerUrl || ""}
          isHost={data.isHost}
          socket={socketRef}
        />
      )}
    </>
  );
}

export default JoinInterview;
