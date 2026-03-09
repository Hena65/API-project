const projectService = require('../services/project.service')

const createProject = async (req, res, next) => {
    try {
        const project = await projectService.createProject(req.body, req.user)
        res.status(201).json({
            message: "project created successfully",
            project
        })
    } catch (error) {
        next(error)
    }
}

const getProjects = async (req, res, next) => {
    try {
        const result = await projectService.getProjects(req.query, req.user)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

const getProjectById = async (req, res, next) => {
    try {
        const project = await projectService.getProjectById(req.params.id, req.user)

        if (!project) {
            return res.status(404).json({ message: "project not found" })
        }

        res.status(200).json(project)
    } catch (error) {
        next(error)
    }
}

const updateProject = async (req, res, next) => {
    try {
        const updated = await projectService.updateProject(req.params.id, req.body, req.user)

        if (!updated) {
            return res.status(404).json({ message: "project not found" })
        }

        res.status(200).json(updated)
    } catch (error) {
        next(error)
    }
}

const deleteProject = async (req, res, next) => {
    try {
        const deleted = await projectService.deleteProject(req.params.id, req.user)

        if (!deleted) {
            return res.status(404).json({ message: "project not found" })
        }

        res.status(200).json(deleted)
    } catch (error) {
        next(error)
    }
}



const addManager = async (req, res, next) => {
    try {

        const project = await projectService.addManager(
            req.params.id,
            req.body.userId,
            req.user
        )

        res.status(200).json({
            message: "Manager added successfully",
            project
        })

    } catch (error) {
        next(error)
    }
}

const removeManager = async (req, res, next) => {
    try {

        const project = await projectService.removeManager(
            req.params.id,
            req.params.userId,
            req.user
        )

        res.status(200).json({
            message: "Manager removed successfully",
            project
        })

    } catch (error) {
        next(error)
    }
}



const addMember = async (req, res, next) => {
    try {

        const project = await projectService.addMember(
            req.params.id,
            req.body.userId,
            req.user
        )

        res.status(200).json({
            message: "Member added",
            project
        })

    } catch (error) {
        next(error)
    }
}

const removeMember = async (req, res, next) => {
    try {

        const project = await projectService.removeMember(
            req.params.id,
            req.params.userId,
            req.user
        )

        res.status(200).json({
            message: "Member removed successfully",
            project
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addManager,
    removeManager,
    addMember,
    removeMember
}

