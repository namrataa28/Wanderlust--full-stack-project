if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

const dbUrl = process.env.ATLAS_URL;

main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

const store = mongoStore.create({
    mongoUrl:"mongodb://127.0.0.1:27017/Wanderlust",
    crypto:{
        secret:"mysupersecretcode",
    },
    touchAfter:24*3600,
});

store.on("error",(err) => {
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const expressOption = {
    store,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};

app.use(session(expressOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


// Demo user Route
// app.get("/demouser",async(req,res) => {
//     let fakeUser = new user({
//         email:"panda11@gmail.com",
//         username:"Panda"
//     });

//     let registeredUser = await user.register(fakeUser,"panduu");
//     res.send(registeredUser);
// })

const listingRouter = require("./Routes/listings.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/",(req,res) => {
//     res.send("Successfully connected");
// })

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next) => {
    next(new ExpressError(404,"PAGE NOT FOUND!"));
})

app.use((err,req,res,next) => {
    let{statusCode=500,message="Something went wrong"} = err;
         res.render("error.ejs" ,{message});
})

app.listen(8080,(req,res) => {
    console.log("Listening on port: 8080");
})
