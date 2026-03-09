const { isUserOnline } = require("../utils/presence.util")

const getUserStatus = async (req, res, next) => {
  try {

    const userId = req.params.userId

    const online = await isUserOnline(userId)

    res.status(200).json({
      userId,
      online
    })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUserStatus
}

