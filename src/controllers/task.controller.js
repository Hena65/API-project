const taskService = require('../services/task.service')


const createTask = async (req, res, next) => {
    try {

        const task = await taskService.createTask(
            req.params.projectId,
            req.body,
            req.user
        )

        res.status(201).json({
            message: "Task created successfully",
            task
        })

    } catch (error) {
        next(error)
    }
}


const getTasks = async (req, res, next) => {
    try {

        const result = await taskService.getTasks(
            req.params.projectId,
            req.query,
            req.user
        )

        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}


const getTaskById = async (req, res, next) => {
    try {

        const task = await taskService.getTaskById(
            req.params.taskId,
            req.user
        )

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        res.status(200).json(task)

    } catch (error) {
        next(error)
    }
}


const updateTask = async (req, res, next) => {
    try {

        const updated = await taskService.updateTask(
            req.params.taskId,
            req.body,
            req.user
        )

        if (!updated) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        res.status(200).json(updated)

    } catch (error) {
        next(error)
    }
}


const deleteTask = async (req, res, next) => {
    try {

        const deleted = await taskService.deleteTask(
            req.params.taskId,
            req.user
        )

        if (!deleted) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        res.status(200).json({
            message: "Task deleted successfully"
        })

    } catch (error) {
        next(error)
    }
}


const updateStatus = async (req, res, next) => {
    try {

        const task = await taskService.updateStatus(
            req.params.taskId,
            req.body.status,
            req.user
        )

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        res.status(200).json({
            message: "Task status updated",
            task
        })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateStatus
}

