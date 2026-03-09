require('dotenv').config()
const http = require('node:http')

const app = require('./src/app')
const connectDB = require('./src/config/db')
const { connectRedis } = require('./src/config/redis')
const { initSocket } = require('./src/config/socket')

const server = http.createServer(app)

const PORT = 3000

async function startserver(){
    try{
        await connectRedis()
        await connectDB()

        
        initSocket(server)

        server.listen(PORT, () => {
            console.log(`server running at http://localhost:${PORT}`)
        })

    }catch(error){
        console.error("Database connection failed due to ", error)
        process.exit(1)
    }
}

startserver()

