const socket = io()

// reference to HTML elements
const formulario = document.querySelector('#formulario')
const input = document.querySelector('#texto')
const botonEnviar = document.querySelector('#send-location')
const sendButton = document.querySelector('#sendButton')
const $messages = document.querySelector('#messages')
const $sideBarCont = document.querySelector('#sidebar')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options from url params(query)
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})


const autoscroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild

    // height of last message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight

    // height of messages container
    const  containerHeight = $messages.scrollHeight

    // how far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

// when a message is created
socket.on('message', (message) => {
    // creating the html element ussing mustache templating
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm A')
    })
    // inserting the new html to the element
    $messages.insertAdjacentHTML('beforeend', html)
    // using cutoms autoscroll function to arrange the messages in the window
    autoscroll()
})

// to render the location message to the users in the room
socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        url: location.url,
        createdAt: moment(location.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    // console.log("url",location.url);
})

// render the room data for all users in the room
socket.on('roomData', (roomData) => {
    //console.log(roomData);
    const html = Mustache.render(sidebarTemplate, {
        room: roomData.room,
        users: roomData.users
    })
    $sideBarCont.innerHTML = html
})

// listener for the submit event of the form
formulario.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable button
    sendButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.texto.value
    socket.emit('message', message, (error) => {
        // enable form
        sendButton.removeAttribute('disabled')
        input.value = ''
        input.focus()

        if(error){
            return console.log(error);
        }
        //console.log('Message delivered');
    })
})


// when send button is clicked
botonEnviar.addEventListener('click', () => {
    // validates if navigator geolocation object exists
    if(!navigator.geolocation){
        return alert('Your browser does not suport geolocation')
    }
    // disable button to avoid multiple calls
    botonEnviar.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {

        const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', locationData, () => {
            botonEnviar.removeAttribute('disabled')
                console.log('Location shared')
        })
    })
})

// function that triggers when  a new user joins
socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href= '/'
    }
})





















