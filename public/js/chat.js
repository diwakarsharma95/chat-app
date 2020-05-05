const socket = io()

socket.on('sameName', (messageFromServer) => {
    console.log(messageFromServer)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const messageToServer = e.target.elements.message.value
    socket.emit('commonName', messageToServer)
})