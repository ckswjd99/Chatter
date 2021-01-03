var express = require("express");
var router = express.Router();

const fs = require("fs");
const { rank } = require("../entity/rank");

router.get("/", function (req, res, next) {
    if(req.session.user.rank == rank.ADMIN) {
        res.render("admin");
    }
    else {
        res.render("error", { errorMsg: "Only Admin" });
    }
});

module.exports = router;
