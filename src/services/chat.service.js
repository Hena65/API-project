
const ChatRoom = require("../models/chatRoom.model")
const ChatMessage = require("../models/chatMessage.model")


async function createChatRoom(projectId, ownerId) {
  const room = await ChatRoom.create({
    project: projectId,
    participants: [ownerId]
  })

  return room
}


async function addParticipants(roomId, userIds) {
  const room = await ChatRoom.findByIdAndUpdate(
    roomId,
    {
      $addToSet: {
        participants: { $each: userIds }
      }
    },
    { new: true }
  )

  return room
}


async function removeParticipant(roomId, userId) {
  const room = await ChatRoom.findByIdAndUpdate(
    roomId,
    {
      $pull: { participants: userId }
    },
    { new: true }
  )

  return room
}


async function softDeleteRoom(projectId) {
  const room = await ChatRoom.findOneAndUpdate(
    { project: projectId },
    { isDeleted: true },
    { new: true }
  )

  return room
}


async function getMessages(roomId, { page = 1, limit = 20 }) {

  const skip = (page - 1) * limit

  const messages = await ChatMessage.find({ room: roomId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "name email")

  return messages
}


async function saveMessage(data) {

  const message = await ChatMessage.create({
    room: data.roomId,
    sender: data.senderId,
    message: data.message
  })

  return message
}

module.exports = {
  createChatRoom,
  addParticipants,
  removeParticipant,
  softDeleteRoom,
  getMessages,
  saveMessage
}

