const express = require('express')
const { app, server } = require('./socket/socket')
const cors = require('cors')
const mongoose = require('mongoose')

const userRoutes = require("./routes/user.routes")
const messagesRoutes = require("./routes/messages.routes")


app
.use(cors())
.use(express.json())


require('dotenv').config()


app.use("/api/auth",userRoutes)
app.use("/api/messages",messagesRoutes)
app.get('/api',(req, res)=>{ res.send('hello') })

mongoose.connect(process.env.MONGO_URL)
.then(() => {console.log("DB Connect SuccessFull")})
.catch((err) => {console.log('error connection db',err.message)})


server.listen(process.env.PORT, () => {
    console.log(`SERVER STARTED ON PORT ${process.env.PORT} :-)`)
})


