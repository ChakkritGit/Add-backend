import http from "http"
import { Server } from "socket.io"

let io: Server

const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })
  io.on("connection", (socket) => {
    console.log(`User : ${socket.id} Connected!!`)
    socket.on("send_message", (data) => {
      socket.broadcast.emit("res_message", data)
    })
    socket.on("disconnect", () => {
      console.log(`User : ${socket.id} Disconnected!!`)
    })
  })
}

export { initSocket, io }