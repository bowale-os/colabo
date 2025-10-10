// socket.js
import { io } from "socket.io-client";

let socket = null;

export const createSocket = (token) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
      auth: { token }
    });
  }
  console.log(socket.connected);
  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('Socket disconnected');
    socket = null;
  }
};
