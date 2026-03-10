const express=require('express')
const router=express.Router()

const projectController=require('../controllers/project.controller')
const {isAuthenticated}=require('../middlewares/auth.middleware')
const cacheMiddleware = require("../middlewares/cache.middleware")
const validate=require('../middlewares/validate.middleware')
const projectSchema=require('../validations/project.schema')

router.post("/project",validate(projectSchema), isAuthenticated,projectController.createProject)

router.get("/project", isAuthenticated,cacheMiddleware(300),projectController.getProjects)

router.get("/project/:id", isAuthenticated,cacheMiddleware(300), projectController.getProjectById)

router.put("/project/:id",isAuthenticated,projectController.updateProject)

router.delete("/project/:id", isAuthenticated, projectController.deleteProject)

router.post("/project/:id/managers", isAuthenticated, projectController.addManager)

router.delete("/project/:id/managers/:userId", isAuthenticated, projectController.removeManager)

router.post("/project/:id/members", isAuthenticated, projectController.addMember)

router.delete("/project/:id/members/:userId", isAuthenticated, projectController.removeMember)

module.exports = router