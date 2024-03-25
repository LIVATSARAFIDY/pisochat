const { Server } = require('socket.io')
const { createServer } = require('node:http')
const express = require('express')
const app = express()
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin: ["http://localhost:5173"],
        methods: ["GET","POST","PUT"]
    }
})

let onlineUsers = new Map()

io.on('connection',(socket) => {
    console.log('connection',onlineUsers)
    
    socket.on("add-user", (userId) => {
        if(userId){
            onlineUsers.set(userId, socket.id)
        }
        console.log('userOnLine = ',onlineUsers)
    })

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        console.log(data.to, '  ' ,sendUserSocket)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message)
        }
    })
    

    socket.on("disconnect",(userId)=>{
        console.log("user disconnected")
        onlineUsers.delete(userId)
    })

})

module.exports = {
    app, io, server
}