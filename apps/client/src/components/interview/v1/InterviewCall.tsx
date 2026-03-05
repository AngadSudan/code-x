"use client";

import { useColors } from "@/components/General/(Color Manager)/useColors";
import Container from "./Container";
import Chat from "./Chat";
import { Message } from "@/utils/type";
import { RefObject, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import SOCKET_EVENTS from "@/utils/socket-event";
import toast from "react-hot-toast";
import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
  LocalVideoTrack,
  RemoteUser,
} from "agora-rtc-react";
import { useRouter } from "next/navigation";

import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

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
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  const [localCameraTrack, setLocalCameraTrack] = useState<ICameraVideoTrack>();
  const [localMicTrack, setLocalMicTrack] = useState<IMicrophoneAudioTrack>();

  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);

  const originalCameraTrack = useRef<MediaStreamTrack | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

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

  const handleSubmit = (data: Message) => {
    if (!prop.socket.current) return;

    prop.socket.current.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      author: data.author,
      message: data.message,
      timeStamp: new Date(),
    });

    setMessages([...messages, data]);
  };

  const leaveCall = async () => {
    try {
      await client.leave();
      router.push("/profile");
    } catch (err) {
      console.error("Error leaving call:", err);
    }
  };

  const toggleMic = async () => {
    if (!localMicTrack) return;

    await localMicTrack.setEnabled(isMuted);
    setIsMuted(!isMuted);
  };

  const toggleCamera = async () => {
    if (!localCameraTrack) return;

    await localCameraTrack.setEnabled(isCameraOff);
    setIsCameraOff(!isCameraOff);
  };

  /* ---------------- SCREEN SHARE ---------------- */

  const startScreenShare = async () => {
    if (!localCameraTrack) return;

    const screenResult = await AgoraRTC.createScreenVideoTrack({});

    const screen = Array.isArray(screenResult) ? screenResult[0] : screenResult;

    originalCameraTrack.current = localCameraTrack.getMediaStreamTrack();

    await localCameraTrack.replaceTrack(screen.getMediaStreamTrack(), false);

    screen.on("track-ended", () => {
      stopScreenShare();
    });

    setScreenTrack(screen as any);
  };

  const stopScreenShare = async () => {
    if (!screenTrack || !localCameraTrack || !originalCameraTrack.current)
      return;

    await localCameraTrack.replaceTrack(originalCameraTrack.current, false);

    screenTrack.close();
    setScreenTrack(null);
  };

  /* ---------------- SOCKET EVENTS ---------------- */

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

  /* ---------------- JOIN CHANNEL ---------------- */

  useEffect(() => {
    const init = async () => {
      await client.join(prop.appId, prop.channelName, prop.token, prop.uid);

      const camTrack = await AgoraRTC.createCameraVideoTrack();
      const micTrack = await AgoraRTC.createMicrophoneAudioTrack();

      setLocalCameraTrack(camTrack as any);
      setLocalMicTrack(micTrack as any);

      await client.publish([camTrack, micTrack]);
    };

    init();

    return () => {
      client.leave();
    };
  }, []);

  /* ---------------- REMOTE USER EVENTS ---------------- */

  useEffect(() => {
    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((prev) => {
        if (prev.find((u) => u.uid === user.uid)) return prev;
        return [...prev, user];
      });
    };

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: "video" | "audio",
    ) => {
      await client.subscribe(user, mediaType);

      if (mediaType === "audio") {
        user.audioTrack?.play();
      }

      setRemoteUsers((prev) => {
        const exists = prev.find((u) => u.uid === user.uid);
        if (exists) return [...prev];
        return [...prev, user];
      });
    };

    const handleUserUnpublished = () => {
      setRemoteUsers((prev) => [...prev]);
    };

    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    return () => {
      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
    };
  }, [client]);

  /* ---------------- UI ---------------- */

  return (
    <AgoraRTCProvider client={client}>
      <div className="flex gap-4">
        <div className="relative w-1/2 h-screen">
          <div className="h-1/3">
            {prop.token && (
              <div className="flex gap-4 p-4">
                <div className="relative w-1/2 aspect-video bg-black rounded-lg overflow-hidden">
                  {localCameraTrack && (
                    <LocalVideoTrack track={localCameraTrack} play />
                  )}

                  {/* controls */}
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <button
                      onClick={toggleMic}
                      className="bg-black/60 text-white px-3 py-1 rounded"
                    >
                      {isMuted ? "Unmute" : "Mute"}
                    </button>

                    <button
                      onClick={toggleCamera}
                      className="bg-black/60 text-white px-3 py-1 rounded"
                    >
                      {isCameraOff ? "Camera On" : "Camera Off"}
                    </button>
                  </div>
                </div>

                {remoteUsers.map((user) => (
                  <div
                    key={user.uid}
                    className="relative w-1/2 aspect-video bg-black rounded-lg overflow-hidden"
                  >
                    <RemoteUser user={user} />

                    <div className="absolute bottom-2 left-2 text-white text-sm">
                      {String(user.uid)}
                    </div>
                  </div>
                ))}
              </div>
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
              className="px-5 py-2 rounded-lg bg-red-500 text-white border border-white"
            >
              Leave Call
            </button>

            {!prop.isHost && (
              <button
                onClick={screenTrack ? stopScreenShare : startScreenShare}
                className="px-5 py-2 rounded-lg bg-blue-500 text-white"
              >
                {screenTrack ? "Stop Share" : "Share Screen"}
              </button>
            )}

            {prop.isHost && (
              <button
                className={`ml-auto px-5 py-2 rounded-lg ${colors.background.special} ${colors.text.inverted}`}
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
