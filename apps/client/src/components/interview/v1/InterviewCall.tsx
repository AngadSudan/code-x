import { useColors } from "@/components/General/(Color Manager)/useColors";
import Container from "./Container";
import Chat from "./Chat";
import { Message } from "@/utils/type";
import { RefObject, useEffect, useLayoutEffect, useState } from "react";
import VideoTile from "./videoTile";
import type { Socket } from "socket.io-client";
import SOCKET_EVENTS from "@/utils/socket-event";
import toast from "react-hot-toast";
import HandleRTCVideos from "./HandleRTCVideos";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { useRouter } from "next/navigation";

type Props = {
  appId: string;
  channelName: string;
  token: string;
  uid: string;
  containerUrl: string;
  isHost: boolean;
  socket: RefObject<Socket | null>;
};
function handleJoin(data: { name: string }) {
  toast.success(`${data.name} joined the interview`);
}
function handleLeave(data: { name: string }) {
  toast.success(`${data.name} left the interview`);
}
export default function InterviewCall(prop: Props) {
  const colors = useColors();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }),
  );
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [url, setUrl] = useState(prop.containerUrl || "http://localhost:8443");
  useEffect(() => {
    if (mode === "edit") {
      setUrl(prop.containerUrl || "http://localhost:8443");
    } else {
      setUrl(
        prop.containerUrl + "/proxy/3000" || "http://localhost:8443/proxy/3000",
      );
    }
  }, [mode]);
  //message submission for socket based events
  const handleSubmit = (data: Message) => {
    if (!prop.socket.current) return null;
    console.log(prop.socket.current);
    prop.socket.current.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      author: data.author,
      message: data.message,
      timeStamp: new Date(),
    });
    console.log("socket-event-sent");
    setMessages([...messages, data]);
  };
  const leaveCall = async () => {
    try {
      // if (localMicrophoneTrack) {
      //   localMicrophoneTrack.stop();
      //   localMicrophoneTrack.close();
      // }

      // if (localCameraTrack) {
      //   localCameraTrack.stop();
      //   localCameraTrack.close();
      // }

      await client.leave();

      console.log("Left channel successfully");
      router.push("/profile");
    } catch (err) {
      console.error("Error leaving call:", err);
    }
  };
  // web-socketinstances
  useEffect(() => {
    const socket = prop.socket.current;
    if (!socket) return;

    const receiveHandler = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on(SOCKET_EVENTS.RECIEVE_MESSAGE, receiveHandler);
    socket.on(SOCKET_EVENTS.PARTICIPANT_JOIN, handleJoin);
    socket.on(SOCKET_EVENTS.PARTICIPANT_LEAVE, handleLeave);

    return () => {
      socket.off(SOCKET_EVENTS.RECIEVE_MESSAGE, receiveHandler);
      socket.off(SOCKET_EVENTS.PARTICIPANT_JOIN, handleJoin);
      socket.off(SOCKET_EVENTS.PARTICIPANT_LEAVE, handleLeave);
    };
  }, [prop.socket]);
  return (
    <AgoraRTCProvider client={client}>
      <div className="flex gap-4">
        <div className="relative w-1/2 h-screen ">
          <div className="h-1/3">
            {prop.token && (
              <HandleRTCVideos
                appId={prop.appId}
                channelName={prop.channelName}
                token={prop.token}
                username={prop.uid}
              />
            )}
          </div>
          <aside className="absolute h-2/3 w-full bottom-0 overflow-y-auto">
            <Chat
              messages={messages}
              currentUserId={prop.uid}
              handleSubmit={(data) => handleSubmit(data)}
            />
          </aside>
        </div>
        <div className="h-screen w-full">
          <div
            className={`
    flex items-center gap-4 p-4
    ${colors.background.secondary}
    ${colors.border.defaultThinBottom}
  `}
          >
            {/* Edit / Preview Toggle */}
            <button
              onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
              className={`
      px-5 py-2 rounded-lg text-sm font-medium
      ${colors.background.heroPrimary}
      ${colors.text.inverted}
      ${colors.properties.interactiveButton}
    `}
            >
              {mode === "edit" ? "Switch to Preview" : "Switch to Editor"}
            </button>

            {/* Leave Call */}
            <button
              onClick={leaveCall}
              className={`
      px-5 py-2 rounded-lg text-sm font-medium
      bg-red-500 text-white
      border border-white
      ${colors.properties.interactiveButton}
    `}
            >
              Leave Call
            </button>

            {/* End Interview */}
            {prop.isHost && (
              <button
                className={`
      ml-auto
      px-5 py-2 rounded-lg text-sm font-semibold
      ${colors.background.special}
      ${colors.text.inverted}
      ${colors.properties.interactiveButton}
    `}
              >
                End Interview
              </button>
            )}
          </div>
          <Container containerURL={url} isHost={prop.isHost} />
        </div>
      </div>
    </AgoraRTCProvider>
  );
}
