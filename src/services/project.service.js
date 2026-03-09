const Project=require('../models/project.model')
const clearCache=require('../utils/cache.invalidate')
const chatService=require('./chat.service')
const sortUtil=require('../utils/sort.util')
const filterUtil=require('../utils/filter.util')
const paginationUtil=require('../utils/pagination.util')

const createProject=async(data,user)=>{
    const project=await Project.create({
        name:data.name,
        description:data.description,
        owner:user.userId
    })
    await chatService.createChatRoom(projectId, ownerId)
    return project
}

const getProjects=async(query,user)=>{
    const filter=filterUtil(query)
    const sort=sortUtil(query)
    const {limit,skip}=paginationUtil(query)

    const baseQuery={
        
        isDeleted:false,
        $or:[
            {owner:user.userId},
            {managers:user.userId},
            {members:user.userId}
        ]
        
        
    }
    const projects=await Project.find({
        ...baseQuery,
        ...filter
})
    .sort(sort)
    .limit(limit)
    .skip(skip)
    
    const total=await Project.countDocuments({
        ...baseQuery,
        ...filter
})

    return {
        total,
        count:projects.length,
        projects
    }
}

const getProjectById=async(projectId,user)=>{
    const project=await Project.findOne({
        _id : projectId,
        isDeleted : false,
        $or:[
            {owner:user.userId},
            {managers:user.userId},
            {members:user.userId}
        ]

})
    return project
}

const updateProject=async(projectId,data,user)=>{
     const project = await Project.findOne({
    _id: projectId,
    owner: user.userId,
    isDeleted: false
  })

  if (!project) {
    throw new Error("Only owner can update project")
  }

  Object.assign(project, data)

  await project.save()

  await clearCache("projects*")
  return project
}

const deleteProject=async(projectId,user)=>{
    const project = await Project.findOne({
    _id: projectId,
    owner: user.userId,
    isDeleted: false
  })

  if (!project) {
    throw new Error("Only owner can delete project")
  }

  project.isDeleted = true

  await project.save()
  await chatService.softDeleteRoom(projectId)
  return project
}

const addMember = async(projectId,memberId,user)=>{

   const project = await Project.findOne({
      _id:projectId,
      isDeleted:false,
      $or:[
         {owner:user.userId},
         {managers:user.userId}
      ]
   })

   if(!project){
      throw new Error("Only manager or owner can add members")
   }

   if(project.members.includes(memberId)){
   throw new Error("User is already a member")
    }

    if(memberId === project.owner.toString()){
   throw new Error("Owner is already part of project")
}
   project.members.push(memberId)

   await project.save()
    await chatService.addParticipants(roomId, [memberId])
   return project
}

const removeMember = async(projectId,memberId,user)=>{

   const project = await Project.findOne({
      _id:projectId,
      isDeleted:false,
      $or:[
         {owner:user.userId},
         {managers:user.userId}
      ]
   })

   if(!project){
      throw new Error("Only manager or owner can remove members")
   }

   const exists = project.members.some(
   id => id.toString() === memberId
)

   if(!exists){
   throw new Error("User is not a member")
}
   project.members = project.members.filter(
      id => id.toString() !== memberId
   )

   await project.save()
   await chatService.removeParticipant(roomId, memberId)
   return project
}

const assignManager = async(projectId,userId,user)=>{

   const project = await Project.findOne({
      _id:projectId,
      owner:user.userId,
      isDeleted:false
   })

   if(!project){
      throw new Error("Only owner can assign managers")
   }

  const isMember = project.members.some(
   id => id.toString() === userId
)

    if(!isMember){
   throw new Error("User must be a member first")
    }

   if(project.managers.includes(userId)){
   throw new Error("User is already a manager")
}

    const managerProjects = await Project.countDocuments({
   managers: userId,
   isDeleted:false
})

   if(managerProjects >= 3){
   throw new Error("User already manages 3 projects")
}
   project.managers.push(userId)

   await project.save()
    await chatService.addParticipants(roomId, [managerId])
   return project
}

const removeManager = async(projectId,userId,user)=>{

   const project = await Project.findOne({
      _id:projectId,
      owner:user.userId,
      isDeleted:false
   })

   if(!project){
      throw new Error("Only owner can remove managers")
   }

   if(userId === project.owner.toString()){
   throw new Error("Owner cannot be removed")
}

    const exists = project.managers.some(
   id => id.toString() === userId
)

    if(!exists){
   throw new Error("User is not a manager")
}
   project.managers = project.managers.filter(
      id => id.toString() !== userId
   )

   await project.save()

   return project
}

module.exports={createProject,getProjects,getProjectById,updateProject,deleteProject,addMember,removeMember,assignManager,removeManager}