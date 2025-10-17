// services/socket.js
import { io } from "socket.io-client";

// Singleton pattern for the socket connection
let socket = null;

export const createSocket = (token) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected!", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket manually disconnected");
  }
};
