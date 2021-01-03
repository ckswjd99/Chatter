var express = require("express");
var router = express.Router();

const fs = require("fs");

/* GET users listing. */
router.get("/", function (req, res, next) {
  const { users: userList } = JSON.parse(
    fs.readFileSync(__dirname + "/../data/user.json").toString()
  );
  res.render("userList.ejs", { userList });
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
    if (findUserById !== undefined && findUserById.hashedPw == loginPw) {
      req.session.user = {
        id: findUserById.id,
        name: findUserById.name,
      };
      console.log(findUserById.name, " logined");
      res.redirect("/");
    } else {

    /* LOGIN FAILED */
      res.render("error", { errorMsg: "LoginFailed" });
    }
  }
});

router.post("/signUp", function (req, res) {
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
      originalUserData.users.push({
        pk: originalUserData.totalNum + 1,
        id: signUpId,
        hashedPw: signUpPw,
        salt: "",
        name: signUpName,
      });
      originalUserData.totalNum = originalUserData.totalNum + 1;
      fs.writeFileSync(
        __dirname + "/../data/user.json",
        JSON.stringify(originalUserData)
      );
      res.render("success", { msg: "SignUp Success" });
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
