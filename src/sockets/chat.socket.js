const ChatMessage = require("../models/chatMessage.model")
const { saveMessage } = require("../services/chat.service")

module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("Socket connected:", socket.id)

    socket.on("joinRoom", (projectId) => {

      const room = `project:${projectId}`

      socket.join(room)

      console.log("User joined room:", room)

    })

    socket.on("sendMessage", async (data) => {

      const { projectId, roomId, senderId, message } = data

      const newMessage = await ChatMessage.create({
        room: roomId,
        sender: senderId,
        message
      })

      io.to(`project:${projectId}`).emit("newMessage", newMessage)
      await saveMessage(newMessage)


    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id)
    })

  })

}

