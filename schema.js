const Joi = require('joi');
module.exports.listingSchema = Joi.object({
    lisitng: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
    })
});

module.exports.ReviewSchema = Joi.object({
     review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
     }).required(),
});