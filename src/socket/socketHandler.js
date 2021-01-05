const fs = require('fs');
const { rank } = require('../entity/rank');

let roomClients = {}

function socketHandler (io) {
    return function(socket) {
        const session = socket.request.session;
        const user = session.user;
        let room;

        socket.on('Enter Room', (rn) => {
            if(rn == user.roomName) {
                room = JSON.parse(fs.readFileSync(__dirname + "/../data/chatRoom.json").toString()).rooms.find(rf => rf.name == rn)
                socket.join(rn)
                io.to(room.name).emit('Chat', {
                    userName: "SYSTEM",
                    msg: `user ${user.name} entered!`
                })
                
                if(roomClients[rn] === undefined) {
                    roomClients[rn] = [user.name]
                }
                else{
                    roomClients[rn].push(user.name)
                }
                console.log(roomClients)
                io.to(room.name).emit('Update Members', roomClients[rn])
            }
            else {
                console.log(user, "Illegal Attempt")
            }
        })
        
        socket.on('Chat', (chatie) => {
            if(!room) {
                socket.emit('Chat', {
                    userName: "SYSTEM",
                    msg: "Yet to Join a Room."
                })
            }
            else if(room.type == "ANNOUNCEMENT" && user.id != room.master && user.rank != rank.ADMIN) {
                socket.emit('Chat', {
                    userName: "SYSTEM",
                    msg: "You don't have permission to chat here."
                })
            }
            else{
                io.to(room.name).emit('Chat', {
                    userName: user.name,
                    msg: chatie.msg
                })
            }
            
        })

        socket.on('disconnect', () => {
            if(room){
                io.to(room.name).emit('Chat', {
                    userName: "SYSTEM",
                    msg: `user ${user.name} left!`
                })
                
                const userIndex = roomClients[room.name].indexOf(user.name)
                roomClients[room.name].splice(userIndex, 1)
                console.log(roomClients)

                io.to(room.name).emit('Update Members', roomClients[room.name])
            }
        })
    }
}

module.exports = socketHandler