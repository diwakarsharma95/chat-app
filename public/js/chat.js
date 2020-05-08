const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $location = document.querySelector('#location')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML 


//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.on('sameName', (messageFromServer) => {
    console.log(messageFromServer.username)
    const html = Mustache.render(messageTemplate, {
        username: messageFromServer.username,
        message: messageFromServer.text,
        createdAt: moment(messageFromServer.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage',(position)=>{
    console.log(position)
    const html = Mustache.render(locationTemplate, {
        username: position.username,
        url: position.url,
        createdAt: moment(position.createdAt).format('hh:mm a')
    })
    $location.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //disable
    $messageFormButton.setAttribute('disabled','disabled')

    const messageToServer = e.target.elements.message.value
    socket.emit('commonName', messageToServer, (callbackMessageFromServer) => {
        
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(callbackMessageFromServer){
            return alert(callbackMessageFromServer)
        }
        console.log('Message delivered!')
    })
})
$locationButton.addEventListener('click', () => {
    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browner')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        },(callbackMessageFromServer) => {
            $locationButton.removeAttribute('disabled')     
            console.log(callbackMessageFromServer)
        })
    })
})

socket.emit('join', {username, room},(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})