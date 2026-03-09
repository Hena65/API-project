
const express = require("express")

const router = express.Router()

const chatController = require("../controllers/chat.controller")
const {isAuthenticated} = require("../middlewares/auth.middleware")


router.get(
  "/project/:projectId",
  isAuthenticated,
  chatController.getChatRoom
)


router.get(
  "/room/:roomId/participants",
  isAuthenticated,
  chatController.getParticipants
)


router.get(
  "/room/:roomId/messages",
  isAuthenticated,
  chatController.getMessages
)

module.exports = router

