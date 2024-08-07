module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "Please login first");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedURL = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
        console.log(res.locals.redirectURL);
    }
    next();
}


