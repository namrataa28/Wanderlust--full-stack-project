const User = require("../models/user");

module.exports.signupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res) => {
    try{
        let {username, email, password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
    res.redirect("/listing");
    })
    } catch(err){
        req.flash("error","Username already exists!");
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req,res) => {
    req.flash("success","Welcome To Wanderlust!");
    let redirect = res.locals.redirectUrl || "/listing"
    res.redirect(redirect);
}

module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err){
            return next(err)
        } else{
            req.flash("success","User logged out successfully!");
            res.redirect("/listing");
        }
    }
)
}