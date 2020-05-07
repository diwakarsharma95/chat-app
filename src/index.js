const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 4000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))








io.on('connection', (socket) => {
    console.log('New WeSocket Connection')

    socket.emit('sameName', generateMessage('Welcome!'))
    socket.broadcast.emit('sameName', generateMessage('A new user has joined'))

    socket.on('commonName', (messageFromClient, callback) => {
        const filter = new Filter()

        if(filter.isProfane(messageFromClient)){
            return callback('Profanity is not allowed!')
        }
        io.emit('sameName',generateMessage(messageFromClient))
        callback()
    })
    socket.on('sendLocation',({latitude, longitude},callback) => {
        io.emit('locationMessage',generateLocationMessage({latitude,longitude}))
        callback('Location shared')
    })
    socket.on('disconnect',() => {
        io.emit('sameName', generateMessage('A user has left'))
    })
})



server.listen(4000, () => {
    console.log(`Server is up on port ${port}`)
})

