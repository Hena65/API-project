
const ChatRoom = require("../models/chatRoom.model")
const chatService = require("../services/chat.service")

/**
 * Get chat room by project
 */
async function getChatRoom(req, res, next) {
  try {
    const { projectId } = req.params

    const room = await ChatRoom.findOne({
      project: projectId,
      isDeleted: false
    }).populate("participants", "name email")

    if (!room) {
      return res.status(404).json({
        message: "Chat room not found"
      })
    }

    res.status(200).json(room)

  } catch (error) {
    next(error)
  }
}

/**
 * Get chat participants
 */
async function getParticipants(req, res, next) {
  try {
    const { roomId } = req.params

    const room = await ChatRoom.findById(roomId)
      .populate("participants", "name email")

    if (!room) {
      return res.status(404).json({
        message: "Chat room not found"
      })
    }

    res.status(200).json({
      participants: room.participants
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Get chat messages
 */
async function getMessages(req, res, next) {
  try {
    const { roomId } = req.params

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const messages = await chatService.getMessages(roomId, { page, limit })

    res.status(200).json({
      page,
      limit,
      messages
    })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  getChatRoom,
  getParticipants,
  getMessages
}

