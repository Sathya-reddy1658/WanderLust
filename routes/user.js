const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require("../MOD/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { savedURL } = require('../middleware.js');

router.get("/signUp", async (req, res) => {
    res.render("users/signUp");
});

router.post("/signUp", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let NewUser = new User({ username, email });
        const registeredUser = await User.register(NewUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", "Unable to login");
                return res.redirect("/listings");
            }
            else {
                req.flash("success", "Logged in succesfully");
                return res.redirect("/listings");
            }
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signUp");
    }
}));

router.get("/login", async (req, res) => {
    res.render("users/login");
});

router.post("/login",savedURL, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(async (req, res) => {
    req.flash("success", "logged in succesfully");
    console.log(res.locals.redirectURL); 
    let redirect = res.locals.redirectURL || "/listings";
     res.redirect(redirect);
    
}));

router.get("/logout", async (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", "Unable to logout");
            return res.redirect("/listings");
        }
        else {
            req.flash("success", "Logged out succesfully");
            return res.redirect("/listings");
        }
    })
});

module.exports = router;