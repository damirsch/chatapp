require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const mongoose = require('mongoose')
const middleware = require('./middlewares/error-middlewate')
const http = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(http)

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(middleware)

const start = async () => {
  try{
    await mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    io.on('connection', (soket) => {
      console.log('User connected');
    })
    http.listen(PORT, () => console.log('Server started on port:', PORT))
  }catch(e){
    console.log(e)
  }
}

start()