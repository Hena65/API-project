const Task = require('../models/task.model')
const Project = require('../models/project.model')
const clearCache=require('../utils/cache.invalidate')
const sortUtil = require('../utils/sort.util')
const filterUtil = require('../utils/filter.util')
const paginationUtil = require('../utils/pagination.util')


const createTask = async (projectId, data, user) => {

    const project = await Project.findOne({
        _id: projectId,
        isDeleted: false
    })

    if (!project) {
        throw new Error("Project not found")
    }

    const isProjectUser =
        project.owner.toString() === user.userId ||
        project.managers.includes(user.userId) ||
        project.members.includes(user.userId)

    if (!isProjectUser) {
        throw new Error("You are not part of this project")
    }

    const canAssign =
        project.owner.toString() === data.assignedTo ||
        project.managers.includes(data.assignedTo) ||
        project.members.includes(data.assignedTo)

    if (!canAssign) {
        throw new Error("Task can only be assigned to project members")
    }

    const activeTasks = await Task.countDocuments({
        assignedTo: data.assignedTo,
        status: { $ne: "completed" }
    })

    if (activeTasks >= 5) {
        throw new Error("User already has 5 active tasks")
    }

    const task = await Task.create({
        title: data.title,
        description: data.description,
        project: projectId,
        assignedTo: data.assignedTo,
        createdBy: user.userId,
        dueDate: data.dueDate
    })

    return task
}


const getTasks = async (projectId, query, user) => {

    const project = await Project.findOne({
        _id: projectId,
        isDeleted: false,
        $or: [
            { owner: user.userId },
            { managers: user.userId },
            { members: user.userId }
        ]
    })

    if (!project) {
        throw new Error("Access denied")
    }

    const filter = filterUtil(query)
    const sort = sortUtil(query)
    const { limit, skip } = paginationUtil(query)

    const tasks = await Task.find({
        project: projectId,
        ...filter
    })
        .sort(sort)
        .limit(limit)
        .skip(skip)

    const total = await Task.countDocuments({
        project: projectId,
        ...filter
    })

    return {
        total,
        count: tasks.length,
        tasks
    }
}


const getTaskById = async (taskId, user) => {

    const task = await Task.findById(taskId).populate("project")

    if (!task) {
        return null
    }

    const project = task.project

    const allowed =
        project.owner.toString() === user.userId ||
        project.managers.includes(user.userId) ||
        project.members.includes(user.userId)

    if (!allowed) {
        throw new Error("Access denied")
    }

    return task
}


const updateTask = async (taskId, data, user) => {

    const task = await Task.findById(taskId).populate("project")

    if (!task) {
        return null
    }

    const project = task.project

    const allowed =
        project.owner.toString() === user.userId ||
        project.managers.includes(user.userId)

    if (!allowed) {
        throw new Error("Only owner or manager can update task")
    }

    Object.assign(task, data)

    await task.save()

    await clearCache("tasks*")
    return task
}


const deleteTask = async (taskId, user) => {

    const task = await Task.findById(taskId).populate("project")

    if (!task) {
        return null
    }

    const project = task.project

    if (project.owner.toString() !== user.userId) {
        throw new Error("Only owner can delete tasks")
    }

    await task.deleteOne()

    return task
}


const updateStatus = async (taskId, status, user) => {

    const task = await Task.findById(taskId)

    if (!task) {
        return null
    }

    if (task.assignedTo.toString() !== user.userId) {
        throw new Error("You can update only your tasks")
    }

    task.status = status

    await task.save()

    return task
}


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateStatus
}

