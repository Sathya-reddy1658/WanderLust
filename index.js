const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 2000;
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require("path");
const Listing = require("./MOD/listing.js");
const Review = require("./MOD/reviews.js");
const { listingSchema, ReviewSchema } = require('./schema.js');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");
const cookieParser = require('cookie-parser');
const MONGO_URL = 'mongodb://127.0.0.1:27017/AIR_BNB';
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./MOD/user.js');
const { isLoggedIn } = require('./middleware.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

async function MAIN() {
    await mongoose.connect(MONGO_URL);
}
MAIN().then(() => { console.log("Connected to DB"); }).catch((err) => { console.log(err) });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const sessionOptions = {
    secret: 'mysuppersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        hhtpOnly: true,
    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.CURRuser = req.user;
    next();
});

app.get("/demouser", async (req, res) => {
    const user = new User({ email: "sathya1558@gmail.com", username: "SATHYA-REDDY" });
    const newUser = await User.register(user, "sathya");
    res.send(newUser);

});

//--------------------------------------cookie-learn---------------------------------------//
app.get("/set", (req, res) => {
    res.cookie("name", "reddy", { maxAge: 900000, httpOnly: true, path: '/' }); // 15 minutes
    res.send("Cookie has been set");
});
app.get("/see", (req, res) => {
    res.send(req.cookies);
})
//----------------------------------------------------------------------------------------//


app.use("/listings/reviews/:id", reviewsRouter);
app.use("/listings", listingsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error", { status, message });
});
