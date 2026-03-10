const express =require('express')
const errorHandler=require('./middlewares/error.middleware.js')
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const authRouter = require("./routes/authRouter")
const projectRouter = require("./routes/projectRouter")
const taskRouter = require("./routes/taskRouter")
const presenceRouter = require("./routes/presenceRouter")
const chatRouter = require("./routes/chatRouter")
const rateLimiter=require("./middlewares/ratelimiter.middleware")
const app=express();
app.use(express.json())
app.use(cookieParser())

app.use(rateLimiter({
    limit:100,
    window:60
}))
app.use('/auth',authRouter)
app.use(projectRouter)
app.use('/task',taskRouter)
app.use("/presence", presenceRouter)
app.use("/api/chat", chatRouter)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(errorHandler)




module.exports=app;