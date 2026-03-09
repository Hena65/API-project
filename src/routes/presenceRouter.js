
const express = require("express")
const router = express.Router()

const presenceController = require("../controllers/presence.controller")
const {isAuthenticated} = require("../middlewares/auth.middleware")

router.get(
  "/:userId/status",
  isAuthenticated,
  presenceController.getUserStatus
)

module.exports = router

