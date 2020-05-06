const socket = io()

socket.on('sameName', (messageFromServer) => {
    console.log(messageFromServer)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const messageToServer = e.target.elements.message.value
    socket.emit('commonName', messageToServer, (callbackMessageFromServer) => {
        if(callbackMessageFromServer){
            return console.log(callbackMessageFromServer)
        }
        console.log('Message delivered!')
    })
})
document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browner')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (callbackMessageFromServer) => console.log(callbackMessageFromServer))
    })
}) 