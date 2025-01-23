const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
let {saveRedirectUrl} = require("../middleware");

const userController = require("../controller/user");

router.get("/signup",userController.signupForm);

router.post("/signup",WrapAsync(userController.signUp));

router.get("/login",userController.loginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),userController.login)

router.get("/logout",userController.logout);

module.exports = router;