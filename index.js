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

const MONGO_URL = 'mongodb://127.0.0.1:27017/AIR_BNB';

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

async function MAIN() {
    await mongoose.connect(MONGO_URL);
}
MAIN().then(() => { console.log("Connected to DB"); }).catch((err) => { console.log(err) });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("ROOT PATH CONTACTED");
});

app.use("/listings/reviews", reviews);
app.use("/listings", listings);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error", { status, message });
});
