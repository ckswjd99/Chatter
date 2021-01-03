const fs = require("fs");

function socketHandler (socket) {
    console.log("socket in: ", socket.handshake.session.user)
    let chatRoomName = ""
    socket.on('enterChatRoom', (msg) => {
        const roomList = JSON.parse(
            fs.readFileSync(__dirname + "/../data/chatRoom.json").toString()
        )
        const findRoomByName = roomList.find((rlf) => {rlf.name == msg})
    })
}

exports.socketHandler = socketHandler