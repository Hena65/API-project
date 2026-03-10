
const express = require("express")
const router = express.Router()

const taskController = require("../controllers/task.controller")
const {isAuthenticated} = require("../middlewares/auth.middleware")
const cacheMiddleware = require("../middlewares/cache.middleware")
const validate=require('../middlewares/auth.middleware')
const taskSchema=require('../validations/task.schema')

router.post(
  "/projects/:projectId/tasks",
  validate(taskSchema),
  isAuthenticated,
  taskController.createTask
)

router.get(
  "/projects/:projectId/tasks",
  isAuthenticated,
  cacheMiddleware(300),
  taskController.getTasks
)

router.get(
  "/:taskId",
  isAuthenticated,
  cacheMiddleware(300),
  taskController.getTaskById
)

router.patch(
  "/:taskId",
  isAuthenticated,
  taskController.updateTask
)

router.delete(
  "/:taskId",
  isAuthenticated,
  taskController.deleteTask
)

router.patch(
  "/:taskId/status",
  isAuthenticated,
  taskController.updateStatus
)

module.exports = router
