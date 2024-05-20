const express = require('express');
const router = express.Router();
const Listing = require("../MOD/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../MOD/reviews.js");

const validateReview = (req, res, next) => {
    let { error } = ReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }
    next();
}
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    res.redirect(`/listings/${id}`);
}));

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;