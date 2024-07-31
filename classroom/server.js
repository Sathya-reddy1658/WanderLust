const express = require("express");
const session = require("express-session");
const app = express();
const path = require('path');
const flash = require('connect-flash')
app.use(session({ secret: 'mysupersecret', resave: false, saveUninitialized: true }));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use((req, res, next) => {
    res.locals.err = req.flash("err");
    res.locals.success = req.flash("success");
    next();
})

app.get("/test", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`You opened ${req.session.count} times`);
});

app.get('/register', (req, res) => {
    let { name = "anon" } = req.query;
    req.session.name = name;

    if (name === 'anon') {
        req.flash("err", "name error");
    }
    else {
        req.flash("success", "user registered successfully");
    }
    res.redirect('/hello');
})
app.get('/hello', (req, res) => {
    res.render('home', { name: req.session.name });
})
app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});
