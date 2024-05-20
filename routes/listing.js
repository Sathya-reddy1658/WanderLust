const express = require('express');
const router = express.Router();

const Review = require("../MOD/reviews.js");
const Listing = require("../MOD/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, ReviewSchema } = require('../schema.js');




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

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));
router.post("/delete/:id", wrapAsync(async (req, res) => {
    console.log("hiii");
    const { id } = req.params;
    const deletedItem = await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect("/listings");
}));

router.get("/new", (re, res) => {
    res.render("./listings/new.ejs");
})
router.post("/:id", wrapAsync(async (req, res) => {
    console.log("hiii1");
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/");
}));

router.get("/:id", wrapAsync(async (req, res) => {
    console.log("hiii2");
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
}));

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/");

}))

router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}));
//------------------------- ADD ALL ROUTES BEFORE THIS ----------------------------\\
router.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})
router.use((err, req, res, next) => {
    let { status = 500, message = "something is wrong" } = err;
    res.render("error", { status, message });

})
//update
module.exports = router;

