const ChatRoom = require("../models/chatRoom.model")
const Project = require("../models/project.model")
const { saveMessage } = require("../services/chat.service")
const jwt = require("jsonwebtoken")

module.exports = (io) => {


io.use((socket, next) => {

  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error("Authentication required"))
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
    socket.user = decoded
    next()

  } catch (err) {
    next(new Error("Invalid token"))
  }

})

  io.on("connection", (socket) => {

    console.log("Socket connected:", socket.id)

    socket.on("joinRoom", async ({ projectId}) => {
        const userId=socket.user.userId
      try {

        const project = await Project.findById(projectId)

        if (!project) {
          return socket.emit("error", "Project not found")
        }

        const isOwner = project.owner.toString() === userId
        const isManager = project.managers.some(id => id.toString() === userId)
        const isMember = project.members.some(id => id.toString() === userId)

        if (!isOwner && !isManager && !isMember) {
          return socket.emit("error", "Not authorized")
        }

        const room = `project:${projectId}`

        socket.join(room)

        console.log(`User ${userId} joined ${room}`)

      } catch (err) {
        console.error(err)
        socket.emit("error", "Join room failed")
      }

    })

   socket.on("sendMessage", async (data) => {

  try {

    const { projectId, message } = data
    const senderId = socket.user.userId

    const room = await ChatRoom.findOne({ project: projectId, isDeleted:false })

    if (!room) {
      return socket.emit("error", "Chat room not found")
    }

    const isParticipant = room.participants.some(
      id => id.toString() === senderId
    )

    if (!isParticipant) {
      return socket.emit("error", "Not allowed in this chatroom")
    }

    const newMessage = await saveMessage({
      roomId: room._id,
      senderId,
      message
    })

    io.to(`project:${projectId}`).emit("newMessage", newMessage)

  } catch (err) {

    console.error(err)
    socket.emit("error", "Message send failed")

  }

})

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id)
    })

  })

}