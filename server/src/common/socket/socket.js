import { Server } from "socket.io"

import { env } from "../config/env.js"
import { SOCKET_EVENTS } from "./socket-event.js"

let io = null;

export function initSocket(httpserver) {
    io = new Server(httpserver, {
        cors: {
            origin: env.clientUrl,
            credentials: true,
        }
    })

  io.on("connection", (socket) => {
    socket.on(SOCKET_EVENTS.POLL_JOIN, (pollId) => {
      if (!pollId) {
        return;
      }

      socket.join(getPollRoom(pollId));
    });

    socket.on(SOCKET_EVENTS.POLL_LEAVE, (pollId) => {
      if (!pollId) {
        return;
      }

      socket.leave(getPollRoom(pollId));
    });
  });

  return io;
}
    

export function getSocketServer() {
    return io;
}

export function getPollRoom(pollId) {
    return `poll_${pollId}`
}

export function emitPollRoom(pollId, event, payload) {
    if (!io) return

    io.to(getPollRoom(pollId)).emit(event, payload)
}