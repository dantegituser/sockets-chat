const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage,generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { log } = require('console')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000;

// define paths for express config
const staticPath = path.join(__dirname,'../public')
// define static directory to serve
app.use(express.static(staticPath))

// let count = 0
io.on('connection', (socket) => {
    //console.log('new websocket connection')

    // event handler to watch when a user join
    socket.on('join', (options, callback) => {

        const {error, user} = addUser({id: socket.id, ...options })

        if(error){
            return callback(error)
        }
        // retrieving all users from same room , array
        const users = getUsersInRoom(user.room)
        // assigns the user to specific room
        socket.join(user.room)
        // send some custom messages
        socket.emit('message',generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))
        // passing the data to the room
        io.to(user.room).emit('roomData', {
            room: user.room,
            users
        })
        callback()
    })


    // operations to execute when a message is written
    socket.on('message', (value, callback) => {

        // getting the current user
        const {user} = getUser(socket.id)
        const filter = new Filter()
        
        if(filter.isProfane(value)){
            return callback('Profanity is not allowed')
        }
        // broadcast the message to all users in the room
        io.to(user.room).emit('message', generateMessage(user.username,value))
        callback()
    })

    // when user send location
    socket.on('sendLocation', (value, callback) => {
        const {user} = getUser(socket.id)
        const locationUrl = `https://google.com/maps?q=${value.latitude},${value.longitude}`
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,locationUrl))
        callback()
    })

    // handling disconnection
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })    
})


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})


















