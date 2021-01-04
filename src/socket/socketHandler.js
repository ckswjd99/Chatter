const fs = require('fs');
const { rank } = require('../entity/rank');

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
                console.log(user, "joined ", rn)
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
    }
}

module.exports = socketHandler