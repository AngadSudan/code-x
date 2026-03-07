"use client";

import { useColors } from "@/components/General/(Color Manager)/useColors";
import Container from "./Container";
import Chat from "./Chat";
import { Message } from "@/utils/type";
import { RefObject, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import SOCKET_EVENTS from "@/utils/socket-event";
import toast from "react-hot-toast";
import HandleRTCVideos from "./HandleRTCVideos";
import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
  useJoin,
} from "agora-rtc-react";
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

  const client = useRTCClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [screen, setScreen] = useState(null);
  const [screenSharing, setscreenSharing] = useState(false);

  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const [url, setUrl] = useState(prop.containerUrl || "http://localhost:8443");

  useJoin(
    {
      appid: prop.appId,
      channel: prop.channelName,
      token: prop.token,
      uid: prop.uid,
    },
    !!prop.token,
  );

  useEffect(() => {
    if (mode === "edit") {
      setUrl(prop.containerUrl || "http://localhost:8443");
    } else {
      setUrl(
        prop.containerUrl + "/proxy/3000" || "http://localhost:8443/proxy/3000",
      );
    }
  }, [mode]);

  const handleSubmit = (data: Message) => {
    if (!prop.socket.current) return;

    prop.socket.current.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      author: data.author,
      message: data.message,
      timeStamp: new Date(),
    });

    setMessages((prev) => [...prev, data]);
  };

  const leaveCall = async () => {
    try {
      await client.leave();
      router.push("/profile");
    } catch (err) {
      console.error("Error leaving call:", err);
    }
  };
  const startScreenShare = async () => {
    try {
      const track = await AgoraRTC.createScreenVideoTrack();

      // find currently published camera track
      const cameraTrack = client.localTracks.find(
        (t) => t.trackMediaType === "video",
      );

      // unpublish camera before publishing screen
      if (cameraTrack) {
        await client.unpublish(cameraTrack);
        cameraTrack.stop();
      }

      await client.publish(track);

      setScreen(track);
      setscreenSharing(true);

      track.on("track-ended", async () => {
        await stopScreenShare();
      });

      toast.success("Screen sharing started");
    } catch (error) {
      console.error("Screen share failed:", error);
      toast.error("Unable to start screen sharing");
    }
  };
  const stopScreenShare = async () => {
    try {
      if (!screen) return;

      await client.unpublish(screen);

      screen.stop();
      screen.close();

      setScreen(null);
      setscreenSharing(false);

      // recreate camera track
      const cameraTrack = await AgoraRTC.createCameraVideoTrack();

      await client.publish(cameraTrack);

      toast.success("Screen sharing stopped");
    } catch (error) {
      console.error("Error stopping screen share:", error);
    }
  };
  // SOCKET EVENTS
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
    <>
      <div className="flex gap-4">
        <div className="relative w-1/2 h-screen">
          <div className="h-1/3">
            {prop.token && (
              <HandleRTCVideos username={prop.uid} isHost={prop.isHost} />
            )}
          </div>

          <aside className="absolute h-2/3 w-full bottom-0 overflow-y-auto">
            <Chat
              messages={messages}
              currentUserId={prop.uid}
              handleSubmit={handleSubmit}
            />
          </aside>
        </div>

        <div className="h-screen w-full">
          <div
            className={`flex items-center gap-4 p-4 ${colors.background.secondary} ${colors.border.defaultThinBottom}`}
          >
            <button
              onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
              className={`px-5 py-2 rounded-lg text-sm font-medium ${colors.background.heroPrimary} ${colors.text.inverted}`}
            >
              {mode === "edit" ? "Switch to Preview" : "Switch to Editor"}
            </button>

            <button
              onClick={leaveCall}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-red-500 text-white border border-white"
            >
              Leave Call
            </button>

            {!prop.isHost && !screenSharing && (
              <button
                onClick={startScreenShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
  bg-green-500 hover:bg-green-600 text-white transition-colors duration-200
  shadow-md hover:shadow-lg"
              >
                Share Screen
              </button>
            )}
            {!prop.isHost && screenSharing && (
              <button
                onClick={stopScreenShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
  bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 
  shadow-md hover:shadow-lg"
              >
                Stop Sharing
              </button>
            )}

            {prop.isHost && (
              <button
                className={`ml-auto px-5 py-2 rounded-lg text-sm font-semibold ${colors.background.special} ${colors.text.inverted}`}
              >
                End Interview
              </button>
            )}
          </div>

          <Container containerURL={url} isHost={prop.isHost} />
        </div>
      </div>
    </>
  );
}
