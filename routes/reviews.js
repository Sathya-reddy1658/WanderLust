const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../MOD/listing.js");
const Review = require("../MOD/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { ReviewSchema } = require('../schema.js');
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
}

router.post("/", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    res.redirect(`/listings/${listing._id}`);
}));

router.get("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
