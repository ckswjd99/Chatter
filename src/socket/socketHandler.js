const fs = require("fs");

function socketHandler (io) {
    return function(socket) {
        const session = socket.request.session;
        const user = session.user;
        let roomName;

        socket.on('Enter Room', (rn) => {
            roomName = rn;
            socket.join(rn);
            console.log(user, "joined ", rn)
        })
        
        socket.on('Chat', (chatie) => {
            if(!roomName) {
                socket.emit('Chat', {
                    userName: "SYSTEM",
                    msg: "Yet to Join a Room."
                })
            }
            else{
                io.to(roomName).emit('Chat', {
                    userName: user.name,
                    msg: chatie.msg
                })            
            }
            
        })
    }
}

module.exports = socketHandler