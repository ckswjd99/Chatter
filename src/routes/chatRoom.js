var express = require("express");
var router = express.Router();

const fs = require("fs");
const { rank } = require("../entity/rank");

router.get("/", function (req, res) {
    try {
        if(req.session.user) {
            if(req.session.user.rank == rank.BANNED) {
                res.render("error", { errorMsg: "You Are Banned User!" })
                return;
            }
    
            const roomList = JSON.parse(
                fs.readFileSync(__dirname + "/../data/chatRoom.json").toString()
            );
    
            const roomName = req.query.name;
            const findRoomByName = roomList.rooms.find((rl) => rl.name == roomName);
            if(!findRoomByName) {
                res.render("error", { errorMsg: "No Such Room" });
                return;
            }
            else{
                if(!findRoomByName.private) {
                    req.session.user.roomName = roomName
                    res.render("chatRoom", { room: findRoomByName })
                    return
                }
                else if(findRoomByName.private && req.query.password == findRoomByName.password) {
                    req.session.user.roomName = roomName
                    res.render("chatRoom", { room: findRoomByName })
                    return
                }
                else if(findRoomByName.private && req.session.user.name == findRoomByName.master) {
                    req.session.user.roomName = roomName
                    res.render("chatRoom", { room: findRoomByName })
                    return
                }
                else if(req.session.user.rank == rank.ADMIN) {
                    req.session.user.roomName = roomName
                    res.render("chatRoom", { room: findRoomByName })
                    return
                }
                res.render("error", { errorMsg: "Cannot Join Room" })
                return
            }
        }
        else {
            res.render("error", { errorMsg: "Log In First" })
        }
    }
    catch (error) {
        console.log(error)
    }
    
});

router.post("/create", function(req, res) {
    try{
        if(req.session.user) {
            const { roomName, type, isPrivate, password } = req.body
    
            const roomList = JSON.parse(
                fs.readFileSync(__dirname + "/../data/chatRoom.json").toString()
            );

            const findRoomByName = roomList.rooms.find((rl) => rl.name == roomName);
            if(findRoomByName){
                res.render("error", { errorMsg: "Room Name Already Exists" })
            }
    
            roomList.rooms.push({
                "pk": (roomList.totalNum + 1),
                "name": roomName,
                "master": req.session.user.id,
                "type": type,
                "private": (isPrivate == "PRIVATE"),
                "password": password
            })
    
            roomList.totalNum = roomList.totalNum + 1
    
            fs.writeFileSync(__dirname + "/../data/chatRoom.json", JSON.stringify(roomList));
            
            res.render("success", { msg: `Chatroom '${roomName}' Created`, link: `/chatroom?name=${roomName}` });
        }
        else {
            res.render("error", { errorMsg: "Login First" })
        }
    }
    catch (error) {
        console.log(error)
    }
})

module.exports = router;

