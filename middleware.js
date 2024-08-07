module.exports.isLoggedIn = (req, res, next) => {
   
    if (!req.isAuthenticated()) {
        req.flash("error", "Please login first");
        console.log(req.originalUrl);
        res.locals.redirectUrl = req.originalUrl;
        console.log(res.locals.redirectUrl);
        return res.redirect("/login");
    }
    next();
}
