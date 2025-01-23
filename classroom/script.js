const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOption = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
};

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/session",(req,res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error","User not registered!");
    }else{
        req.flash("success", "User registered successfully!");
    }
  
    res.send(name);
})

app.get("/hello",(req,res) => {
    res.render("index.ejs",{name:req.session.name});
})

app.listen(3000, () => {
    console.log("Listining on port 3000");
});