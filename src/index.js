const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 4000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))






const messageToClient = 'Welcome!'

io.on('connection', (socket) => {
    console.log('New WeSocket Connection')

    socket.emit('sameName', messageToClient)
    socket.broadcast.emit('sameName', 'A new user has joined')

    socket.on('commonName', (messageFromClient) => {
        io.emit('sameName',messageFromClient)
    })
    socket.on('sendLocation',({latitude,longitude}) => {
        io.emit('sameName',`https://google.com/maps?q=${latitude},${longitude}`)
    })
    socket.on('disconnect',() => {
        io.emit('sameName', 'A user has left')
    })
})







server.listen(4000, () => {
    console.log(`Server is up on port ${port}`)
})

