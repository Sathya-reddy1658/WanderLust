module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('not loged in');
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "Please login first");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedURL = (req, res, next) => {
    console.log(req.session.originalUrl);
    if (req.session.redirectURL) {
        console.log("SAVED");
        res.locals.redirectURL = req.session.redirectURL;
        delete req.session.redirectURL;
        console.log(res.locals.redirectURL);
    }
    next();
}