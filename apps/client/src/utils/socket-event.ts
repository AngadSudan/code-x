const SOCKET_EVENTS = {
  CONNECT: "connection",
  DISCONNECT: "disconnect",
  JOIN_INTERVIEW: "joinRoom",
  LEFT_INTERVIEW: "leftRoom",
  HAND_SHAKE_SUCCESS: "handshake",
  SEND_MESSAGE: "chat:send-message",
  RECIEVE_MESSAGE: "chat:recieved-message",
  PARTICIPANT_JOIN: "interview:join",
  PARTICIPANT_LEAVE: "interview:leave",
};
export default SOCKET_EVENTS;
