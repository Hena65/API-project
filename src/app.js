const express =require('express')
const errorHandler=require('./middlewares/error.middleware.js')
const cookieParser = require("cookie-parser");
const setupSwagger = require("./config/swagger");
const authRouter = require("./routes/authRouter")
const projectRouter = require("./routes/projectRouter")
const taskRouter = require("./routes/taskRouter")
const presenceRouter = require("./routes/presenceRouter")
const chatRouter = require("./routes/chatRouter")

const app=express();
app.use(express.json())
setupSwagger(app);
app.use(cookieParser())


app.use('/auth',authRouter)
app.use(projectRouter)
app.use('/task',taskRouter)
app.use("/presence", presenceRouter)
app.use("/api/chat", chatRouter)


app.use(errorHandler)




module.exports=app;