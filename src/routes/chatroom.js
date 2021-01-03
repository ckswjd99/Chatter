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
            console.log(roomName)
            const findRoomByName = roomList.rooms.find((rl) => rl.name == roomName);
            if(!findRoomByName) {
                res.render("error", { errorMsg: "No Such Room" });
                return;
            }

            res.render("chatRoom", { room: findRoomByName })
        }
        else {
            res.render("error", { errorMsg: "Log In First" })
        }
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;

