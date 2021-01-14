var express = require("express");
var router = express.Router();

const { rank, rankToString } = require("../entity/rank");

router.get("/", function (req, res, next) {
    if(req.session.user.rank == rank.ADMIN) {
        res.render("admin");
    }
    else {
        res.render("error", { errorMsg: "Only Admin" });
    }
});

router.get("/success", function (req, res) {
    res.render("success", { msg: "test success test success test success test success ", link: "/" })
})

router.get("/error", function (req, res) {
    res.render("error", { errorMsg: "test Error" })
})

module.exports = router;
