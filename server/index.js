const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
// Creating the web server

const mongoose = require('mongoose')
const dbName = "xxxxxxx"
const dbPass = "xxxxxxx"
const url = `mongodb+srv://admin:${dbPass}@cluster0.qt1az.mongodb.net/${dbName}?retryWrites=true&w=majority`
//Configuring connection to the MONGODB, note you need to use your own DB in place. The link will also change depending on how you host your server

const cors = require('cors')
app.use(cors())
app.use(express.json())
//Important Middleware

// Connecting to the DB and declaring a SCHEMA for the data
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const messageSchema = new mongoose.Schema({
  content: String,
})
const Message = mongoose.model('messages', messageSchema)


//Opening WEBSOCKET requests, also defines how to handle various requests
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
io.on('connection', (s)=>{
  console.log('A new user has entered the chat room!')   
  s.on('newMessage', (m)=>{
    io.emit('newMessage', m)
  })
  s.on('disconnect', () => {
    console.log('user disconnected');
  })
})

//How to handle various HTTP requests
app.get('/api/messages', (request, response) => {
    Message.find({}).then(messages => {
    response.json(messages)  
  })
})
app.post('/api/messages', (request, response) => {
  const body = request.body
  console.log(body)
  const message  = new Message(body)
  message.save().then(r =>  {
    console.log("message added")    
  })
})

//Lets the server start listening for requests
const PORT = process.env.PORT || 3001
server.listen(PORT,()=>{console.log('listening')});