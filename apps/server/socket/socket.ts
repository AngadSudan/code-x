import chalk from "chalk";
import { Server } from "socket.io";
import type { Socket } from "socket.io";
import cacheClient from "../utils/redis";
import interviewHandler from "./handlers/interviewHandler";
import SOCKET_EVENTS from "../utils/socket-event";
import type { RoomConfig } from "../utils/type";

const initializeSocket = async (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["websocket", "polling"],
    allowEIO3: false,
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  console.log(chalk.blue("Socket.io server started"));

  io.on(SOCKET_EVENTS.CONNECT, async (socket: Socket) => {
    const { room, name, username, role } = socket.handshake.query;
    console.log(
      chalk.bold(
        `New socket connection for room:${room} with socketId:${socket.id}`,
      ),
    );

    //joining into new
    const data = await cacheClient.getCache(`/active-interview/${room}`);
    let roomConfig: RoomConfig | null;
    if (!data) {
      roomConfig = { member: {}, chat: [] };
    } else {
      roomConfig = JSON.parse(data);
    }
    if (roomConfig) {
      const user = roomConfig.member[socket.id];
      if (user) {
        console.log("user already exists!");
      } else {
        roomConfig.member[socket.id] = {
          name: name as string,
          username: username as string,
          role: role as any,
        };
        await cacheClient.setCache(
          `/active-interview/${room}`,
          JSON.stringify(roomConfig),
        );
        console.log(roomConfig);
        console.log("addded user to db");
        socket.join(`/active-interview/${room}`);
        console.log("candidate joined room" + room);
        socket
          .to(`/active-interview/${room}`)
          .emit(SOCKET_EVENTS.PARTICIPANT_JOIN, { name: name });
      }
    }

    interviewHandler(socket, room as string);

    socket.on("disconnect", async () => {
      console.log("Disconnected socket:", socket.id);

      const data = await cacheClient.getCache(`/active-interview/${room}`);
      let roomConfig: RoomConfig | null;

      if (!data) {
        roomConfig = null;
      } else {
        roomConfig = JSON.parse(data);
      }

      if (roomConfig) {
        const user = roomConfig.member[socket.id];

        if (user) {
          delete roomConfig.member[socket.id];
          //@ts-ignore
          if (Object.keys(roomConfig.member).length === 0) {
            console.log("invalidating cache");
            await cacheClient.invalidateCache(`/active-interview/${room}`);
          } else {
            await cacheClient.setCache(
              `/active-interview/${room}`,
              JSON.stringify(roomConfig),
            );
          }

          console.log("removed user from db");
          console.log(roomConfig);
        } else {
          console.log("user not found in room");
          await cacheClient.invalidateCache(`/active-interview/${room}`);
        }
      } else {
        console.log("room not found");
        await cacheClient.invalidateCache(`/active-interview/${room}`);
      }

      socket
        .to(`/active-interview/${room}`)
        .emit(SOCKET_EVENTS.PARTICIPANT_LEAVE, { name: name });
    });

    socket.on("close", async () => {
      console.log("user left the chat");

      const data = await cacheClient.getCache(`/active-interview/${room}`);
      let roomConfig: RoomConfig | null;

      if (!data) {
        roomConfig = null;
      } else {
        roomConfig = JSON.parse(data);
      }

      if (roomConfig) {
        const user = roomConfig.member[socket.id];

        if (user) {
          delete roomConfig.member[socket.id];

          if (Object.keys(roomConfig.member).length === 0) {
            console.log("invalidating cache");
            await cacheClient.invalidateCache(`/active-interview/${room}`);
          } else {
            await cacheClient.setCache(
              `/active-interview/${room}`,
              JSON.stringify(roomConfig),
            );
          }

          console.log("removed user from db");
          console.log(roomConfig);
        } else {
          console.log("user not found in room");
          await cacheClient.invalidateCache(`/active-interview/${room}`);
        }

        socket
          .to(`/active-interview/${room}`)
          .emit(SOCKET_EVENTS.PARTICIPANT_LEAVE, { name: name });
      } else {
        console.log("room not found");
        await cacheClient.invalidateCache(`/active-interview/${room}`);
      }
    });

    socket.on("error", (err: any) => {
      console.error("Socket error:", err);
    });
  });

  return io;
};

export { SOCKET_EVENTS };
export default initializeSocket;
