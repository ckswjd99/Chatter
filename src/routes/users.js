var express = require("express");
var router = express.Router();

require('dotenv').config();
const fs = require("fs");
const crypto = require('crypto')

const { rank, rankToString } = require('../entity/rank')

/* GET users listing. */
router.get("/", function (req, res, next) {
  const { users: userList } = JSON.parse(
    fs.readFileSync(__dirname + "/../data/user.json").toString()
  );
  res.render("userList.ejs", {
    userList: userList.map(function(ulm) {
      return {
        rank: rankToString(ulm.rank),
        userName: ulm.name
      }
    })
  });
});

router.post("/signIn", function (req, res) {
  if (req.session.user) {
    res.render("error", { errorMsg: "AlreadySignIn" });
  } else {
    const userList = JSON.parse(
      fs.readFileSync(__dirname + "/../data/user.json").toString()
    );
    const loginId = req.body.id;
    const loginPw = req.body.pw;

    const findUserById = userList.users.find((ul) => ul.id == loginId);

    /* LOGIN SUCCEED */
    const hashingNum = Number(process.env.HASH_NUM);

    if (findUserById !== undefined) {
      crypto.pbkdf2(loginPw, findUserById.salt, hashingNum, 64, 'sha512', (err, key) => {
        if(key.toString('base64') === findUserById.hashedPw) {
          req.session.user = {
            id: findUserById.id,
            name: findUserById.name,
            rank: findUserById.rank
          };
          console.log(findUserById.name, " logined");
          res.redirect("/");
          return;
        }
        else {
          res.render("error", { errorMsg: "LoginFailed" })
          return;
        }
      });
    } else {
    /* LOGIN FAILED */
      res.render("error", { errorMsg: "LoginFailed" });
    }
  }
});

router.post("/signUp", async function (req, res) {
  if (req.session.user) {
    res.render("error", { errorMsg: "AlreadySignIn" });
  } else {
    const userList = JSON.parse(
      fs.readFileSync(__dirname + "/../data/user.json").toString()
    );

    const signUpId = req.body.id;
    const signUpPw = req.body.pw;
    const signUpName = req.body.name;

    const findUserById = userList.users.find((ul) => ul.id == signUpId);
    const findUserByName = userList.users.find((ul) => ul.name == signUpName);

    if (findUserById) {
      res.render("error", { errorMsg: "Id Already Exists" });
    }
    if (findUserByName) {
      res.render("error", { errorMsg: "Name Already Exists" });
    }
    if (!signUpPw) {
      res.render("error", { errorMsg: "Please Enter Password" });
    } else {
      const originalUserData = JSON.parse(
        fs.readFileSync(__dirname + "/../data/user.json").toString()
      );
      
      const hashingNum = Number(process.env.HASH_NUM);

      crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(signUpPw, buf.toString('base64'), hashingNum, 64, 'sha512', (err, key) => {
          originalUserData.users.push({
            pk: originalUserData.totalNum + 1,
            id: signUpId,
            hashedPw: key.toString('base64'),
            salt: buf.toString('base64'),
            name: signUpName,
            rank: originalUserData.totalNum ? rank.NORMAL : rank.ADMIN
          });
          originalUserData.totalNum = originalUserData.totalNum + 1;
          fs.writeFileSync(
            __dirname + "/../data/user.json",
            JSON.stringify(originalUserData)
          );
        });
      });
      res.render("success", { msg: "SignUp Success", link: "/" });
    }
  }
});

router.post("/signOut", function (req, res) {
  if (!req.session.user) {
    res.render("error", { errorMsg: "NotSignedIn" });
  } else {
    req.session.destroy(function (err) {
      if (err) {
        res.render("error", { errorMsg: "Cannot Destry Session" });
        return;
      }
      res.redirect("/");
    });
  }
});

module.exports = router;
