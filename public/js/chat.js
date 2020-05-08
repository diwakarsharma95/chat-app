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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // New Message element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('sameName', (messageFromServer) => {
    const html = Mustache.render(messageTemplate, {
        username: messageFromServer.username,
        message: messageFromServer.text,
        createdAt: moment(messageFromServer.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage',(position)=>{
    const html = Mustache.render(locationTemplate, {
        username: position.username,
        url: position.url,
        createdAt: moment(position.createdAt).format('hh:mm a')
    })
    $location.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room,users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
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