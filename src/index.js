const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser,getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 4000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))








io.on('connection', (socket) => {
    console.log('New WeSocket Connection')

    socket.on('join', (options,callback) => {
        const {error, user} = addUser({id: socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('sameName', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('sameName', generateMessage(`${user.username} has joined`))
        callback()
    })

    socket.on('commonName', (messageFromClient, callback) => {
        const filter = new Filter()

        if(filter.isProfane(messageFromClient)){
            return callback('Profanity is not allowed!')
        }
        io.to('Brisbane').emit('sameName',generateMessage(messageFromClient))
        callback()
    })
    socket.on('sendLocation',({latitude, longitude},callback) => {
        io.emit('locationMessage',generateLocationMessage({latitude,longitude}))
        callback('Location shared')
    })
    socket.on('disconnect',() => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('sameName', generateMessage(`${user.username} has left`))
        }
    })
})



server.listen(4000, () => {
    console.log(`Server is up on port ${port}`)
})

