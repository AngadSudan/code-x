import type { Socket } from "socket.io";
import { SOCKET_EVENTS } from "../socket";
import cacheClient from "../../utils/redis";
import type { RoomConfig } from "../../utils/type";

export default async function interviewHandler(socket: Socket, room: string) {
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
    const Messagedata = {
      author: data.username,
      message: data.message,
      timestamp: data.timeStamp,
    };
    let roomData = await cacheClient.getCache(`/active-interview/${room}`);
    const roomConf: RoomConfig = JSON.parse(roomData);
    console.log(roomConf);
    roomConf.chat.push(Messagedata);
    await cacheClient.setCache(
      `/active-interview/${room}`,
      JSON.stringify(roomConf),
    );
    socket
      .to(`/active-interview/${room}`)
      .emit(SOCKET_EVENTS.RECIEVE_MESSAGE, Messagedata);

    console.log("event emitted to all the other users");
  });
}
