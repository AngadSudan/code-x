"use client";

import {
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from "agora-rtc-react";

import { useEffect, useState } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

interface Props {
  username: string;
  isHost: boolean;
}

export default function HandleRTCVideos(props: Props) {
  const colors = useColors();

  const { localCameraTrack } = useLocalCameraTrack(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(true);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // publish local tracks
  usePublish(
    localCameraTrack && localMicrophoneTrack
      ? [localCameraTrack, localMicrophoneTrack]
      : [],
  );

  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  const isAlone = remoteUsers.length === 0;

  const toggleMic = async () => {
    if (!localMicrophoneTrack) return;
    await localMicrophoneTrack.setEnabled(isMuted);
    setIsMuted(!isMuted);
  };

  const toggleCamera = async () => {
    if (!localCameraTrack) return;
    await localCameraTrack.setEnabled(isCameraOff);
    setIsCameraOff(!isCameraOff);
  };

  return (
    <div className={`flex gap-4 p-4 rounded-xl ${colors.background.secondary}`}>
      {/* LOCAL TILE */}
      <div
        className={`group relative ${
          isAlone ? "w-full" : "w-1/2"
        } aspect-video rounded-xl overflow-hidden ${colors.border.defaultThin}`}
      >
        {isCameraOff ? (
          <div
            className={`flex items-center justify-center h-full w-full ${colors.background.heroPrimaryFaded}`}
          >
            <p className={`text-lg font-semibold ${colors.text.primary}`}>
              {props.username}
            </p>
          </div>
        ) : (
          localCameraTrack && <LocalVideoTrack track={localCameraTrack} play />
        )}

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent px-4 py-2">
          <p className={`text-sm font-medium ${colors.text.inverted}`}>
            You ({props.username})
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={toggleMic}
            className="px-4 py-2 rounded-full backdrop-blur-md bg-black/40 text-white text-sm"
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>

          <button
            onClick={toggleCamera}
            className="px-4 py-2 rounded-full backdrop-blur-md bg-black/40 text-white text-sm"
          >
            {isCameraOff ? "Turn On Cam" : "Turn Off Cam"}
          </button>
        </div>
      </div>

      {/* REMOTE TILE */}
      {!props.isHost &&
        remoteUsers.map((user) => (
          <div
            key={user.uid}
            className={`relative w-1/2 aspect-video rounded-xl overflow-hidden ${colors.border.defaultThin}`}
          >
            <RemoteUser user={user} />

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent px-4 py-2">
              <p className={`text-sm font-medium ${colors.text.inverted}`}>
                {String(user.uid)}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
