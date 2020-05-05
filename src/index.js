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

    socket.on('commonName', (messageFromClient) => {
        io.emit('sameName',messageFromClient)
    })
})

server.listen(4000, () => {
    console.log(`Server is up on port ${port}`)
})

