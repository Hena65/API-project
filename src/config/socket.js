
const { Server } = require("socket.io")
const chatSocket = require("../sockets/chat.socket")

let io

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  })

  chatSocket(io)

  return io
}

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }
  return io
}

module.exports = {
  initSocket,
  getIO
}

