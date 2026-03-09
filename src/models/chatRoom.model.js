const mongoose = require("mongoose")

const chatRoomSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isDeleted: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
)

module.exports = mongoose.model("ChatRoom", chatRoomSchema)

