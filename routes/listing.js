const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../MOD/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require('../schema.js');
const ExpressError = require("../utils/ExpressError");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
}

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

router.get("/new", (req, res) => {
    res.render("listings/new");
});

router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing added");
    res.redirect("/listings"); 
}));

router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you're trying to access does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you're trying to edit does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
}));

router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated succesfully");
    res.redirect(`/listings/${id}`);
}));

router.delete("/delete/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted succesfully");
    res.redirect("/listings");
}));

module.exports = router;
