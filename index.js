const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 2000;
const Listing = require("./MOD/listing.js");
const Review = require("./MOD/reviews.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/AIR_BNB';
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require("path");
const wrapAync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema, ReviewSchema } = require('./schema.js');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("._method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

async function MAIN() {
    await mongoose.connect(MONGO_URL);
}
MAIN().then(() => { console.log("conneted to DB"); }).catch((err) => { console.log(err) });

app.listen(port, () => {
    console.log(`listening through port ${port}`);
})

app.get("/", (req, res) => {
    res.send("ROOT PATH CONTACTED");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }
    next();
}

const validateReview = (req, res, next) => {
    let { error } = ReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }
    next();
}


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./index.ejs", { allListings });
}));
app.post("/2/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedItem = await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect("/listings");
}));

app.get("/new", (re, res) => {
    res.render("./listings/new.ejs");
})
app.post("/:id", wrapAync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

app.get("/:id", wrapAync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
}));

app.post("/", validateListing, wrapAync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");

}))

app.get("/:id/edit", wrapAync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}));


//reviews of post route 
/*app.post('listing/:id/review', validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    res.redirect(`/listings/${id}`);
}));

app.get('/listing/:id/review/:review_id', wrapAsync(async (req, res) => {

    let { id, review_id } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/listings/${id}`);
}))*/
//------------------------- ADD ALL ROUTES BEFORE THIS ----------------------------\\
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})
app.use((err, req, res, next) => {
    let { status = 500, message = "something is wrong" } = err;
    res.render("error", { status, message });

})
//update


