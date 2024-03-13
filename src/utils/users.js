const users = [];

// controller that manage when new user joins the chat
const addUser = ({id,username,room}) => {

    // clean the data up from input form
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate if data exists
    if(!username || !room){
        return {
            error: 'username and room are required'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if(existingUser){
        return {
            error: 'Username is in use'
        }
    }

    // store user
    const user = {
        id, username, room
    }
    users.push(user)
    return {
        user
    }
}

// disconnect the user from session
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id
    })
    if(!user){
        return undefined
    }
    return {user}

}

// to get all users in the same room
const getUsersInRoom = (room) => {
    
    room = room.trim().toLowerCase()

    const usersInRoom = users.filter((user) => {
        return user.room === room
    })

    if(!usersInRoom){
        return []
    }

    return usersInRoom;

}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};