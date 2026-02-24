import React, { RefObject } from "react";
import { Interviewer, InterviewInfo, User } from "@/utils/type";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import SOCKET_EVENTS from "@/utils/socket-event";
import { useInterviewer } from "@/store/interviewer-store";
import { useUserStore } from "@/store/user-store";
import axiosInstance from "@/utils/axiosInstance";

interface fnHandler {
  isHost: boolean;
  interviewId: string;
  interviewData: React.Dispatch<React.SetStateAction<InterviewInfo | null>>;
  setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  socket: RefObject<Socket | null>;
}

async function getToken(isHost: boolean, interviewId: string) {
  try {
    const role = isHost ? "host" : "guest";
    const channelId = interviewId;

    const response = await axiosInstance.post(
      "/api/v1/interview/meeting/token",
      {
        role,
        channelId,
      },
    );

    console.log(response.data.data);
    //TODO: api call here
    return {
      token:
        "00675bde65a80b14e6fb15f5407ae3948e8IAB3+rVyjyQ3N//Wu290XSmzZDzHdjl0ofwmbWtt7ncwvbueM/ipT8doIgAbnqXr3k+ZaQQAAQBuDJhpAgBuDJhpAwBuDJhpBABuDJhp",
      channelName: "random-abc-bittu",
      uid: "angad-sudan",
      appId: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
    };
  } catch (error) {
    console.log(error);
  }
}

function connectToSocket(
  socketRef: RefObject<any>,
  interviewId: string,
  info: Interviewer | User,
  isHost: boolean,
) {
  try {
    console.log(socketRef);
    const socket: Socket = io(
      process.env.NEXT_PUBLIC_BACKEND_URL +
        `?room=${interviewId}&name=${info.name}&username=${info.username}&role=${isHost ? "HOST" : "CANDIDATE"}`,
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      },
    );
    console.log(socket);
    socketRef.current = socket;
    console.log(socketRef);
    socketRef.current.on(SOCKET_EVENTS.CONNECT, () => {
      console.log(socketRef.current);
      console.log("socket connected");
    });
    socketRef.current.on(SOCKET_EVENTS.HAND_SHAKE_SUCCESS, () => {
      console.log("room joining successful");
    });
  } catch (error: any) {
    console.log("error connecting to socket");
    console.log(error);
  }
}
function InterviewConformation(prop: fnHandler) {
  const theme = useColors();
  const { info: interviewerInfo, hasHydrated } = useInterviewer();
  const { info: intervieweeInfo } = useUserStore();

  const handleClick = async () => {
    const data = await getToken(prop.isHost, prop.interviewId);
    prop.interviewData(data!);
    console.log(prop.socket);
    if (hasHydrated && interviewerInfo !== null) {
      connectToSocket(
        prop.socket,
        prop.interviewId,
        interviewerInfo!,
        prop.isHost,
      );
    } else {
      connectToSocket(
        prop.socket,
        prop.interviewId,
        intervieweeInfo!,
        prop.isHost,
      );
    }

    prop.setConfirmed(true);
  };
  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 ${theme.background.secondary}`}
    >
      <div
        className={`w-full max-w-xl rounded-xl p-6 shadow-md ${theme.background.primary} ${theme.border.fadedThin}`}
      >
        <div className="mb-6 space-y-1">
          <p className={`text-sm ${theme.text.primary}`}>
            Interview ID: <span className="font-mono">{prop.interviewId}</span>
          </p>
        </div>

        <div className="flex gap-4">
          {prop.isHost ? (
            <button
              onClick={handleClick}
              className={`h-12 w-full rounded-lg font-medium ${theme.background.special} ${theme.text.inverted} ${theme.properties.interactiveButton}`}
            >
              Start Interview
            </button>
          ) : (
            <button
              onClick={handleClick}
              className={`h-12 w-full rounded-lg font-medium ${theme.background.special} ${theme.text.inverted} ${theme.properties.interactiveButton}`}
            >
              Join Interview
            </button>
          )}
        </div>

        <p className={`mt-6 text-xs text-center ${theme.text.secondary}`}>
          {prop.isHost
            ? "You’re the host. Starting the interview will allow others to join."
            : "Wait for the host to start, then join when ready."}
        </p>
      </div>
    </div>
  );
}

export default InterviewConformation;
