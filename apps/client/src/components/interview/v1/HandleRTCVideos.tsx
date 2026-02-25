"use client";

import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
  useRTCClient,
} from "agora-rtc-react";
import { useEffect, useState } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

interface Props {
  appId: string;
  channelName: string;
  token: string;
  username: string;
}

export default function HandleRTCVideos(props: Props) {
  const colors = useColors();
  const client = useRTCClient();
  const { localCameraTrack } = useLocalCameraTrack(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(true);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useJoin({
    appid: props.appId,
    channel: props.channelName,
    token: props.token,
    uid: props.username,
  });

  usePublish(
    localCameraTrack && localMicrophoneTrack
      ? [localCameraTrack, localMicrophoneTrack]
      : [],
  );

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  const isAlone = remoteUsers.length === 0;

  // Toggle mic
  const toggleMic = async () => {
    if (!localMicrophoneTrack) return;
    await localMicrophoneTrack.setEnabled(isMuted);
    setIsMuted(!isMuted);
  };

  // Toggle camera
  const toggleCamera = async () => {
    if (!localCameraTrack) return;
    await localCameraTrack.setEnabled(isCameraOff);
    setIsCameraOff(!isCameraOff);
  };
  console.log("Local camera track:", localCameraTrack);
  console.log("Remote users:", remoteUsers);

  useEffect(() => {
    const handleUserPublished = async (user: any, mediaType: any) => {
      console.log("User published:", mediaType);
      await client.subscribe(user, mediaType);
      console.log("Subscribed to:", mediaType);
    };

    client.on("user-published", handleUserPublished);

    return () => {
      client.off("user-published", handleUserPublished);
    };
  }, [client]);
  return (
    <div className={`flex gap-4 p-4 rounded-xl ${colors.background.secondary}`}>
      {/* LOCAL TILE */}
      <div
        className={`
          group relative
          ${isAlone ? "w-full" : "w-1/2"}
          aspect-video rounded-xl overflow-hidden
          ${colors.border.defaultThin}
        `}
      >
        {/* Camera OFF Banner */}
        {isCameraOff ? (
          <div
            className={`
              flex items-center justify-center h-full w-full
              ${colors.background.heroPrimaryFaded}
            `}
          >
            <p className={`text-lg font-semibold ${colors.text.primary}`}>
              {props.username}
            </p>
          </div>
        ) : (
          localCameraTrack && <LocalVideoTrack track={localCameraTrack} play />
        )}

        {/* Bottom Name Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent px-4 py-2">
          <p className={`text-sm font-medium ${colors.text.inverted}`}>
            You ({props.username})
          </p>
        </div>

        {/* Hover Controls */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={toggleMic}
            className={`
              px-4 py-2 rounded-full backdrop-blur-md
              bg-black/40 text-white text-sm
              ${colors.properties.interactiveButton}
            `}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>

          <button
            onClick={toggleCamera}
            className={`
              px-4 py-2 rounded-full backdrop-blur-md
              bg-black/40 text-white text-sm
              ${colors.properties.interactiveButton}
            `}
          >
            {isCameraOff ? "Turn On Cam" : "Turn Off Cam"}
          </button>
        </div>
      </div>

      {/* REMOTE TILE */}
      {remoteUsers.map((user) => {
        const hasVideo = user.videoTrack;
        console.log(user);
        return (
          <div
            key={user.uid}
            className={`
              relative w-1/2 aspect-video rounded-xl overflow-hidden
              ${colors.border.defaultThin}
            `}
          >
            {hasVideo ? (
              <RemoteUser user={user} />
            ) : (
              <div
                className={`
                  flex items-center justify-center h-full w-full
                  ${colors.background.heroSecondaryFaded}
                `}
              >
                <p className={`text-lg font-semibold ${colors.text.primary}`}>
                  {String(user.uid)}
                </p>
              </div>
            )}

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent px-4 py-2">
              <p className={`text-sm font-medium ${colors.text.inverted}`}>
                {String(user.uid)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
