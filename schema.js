const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        image: Joi.object({
            filename: Joi.string().allow("", null).default('listingimage'),
            url: Joi.string().uri().allow("", null)
            .default('https://unsplash.com/photos/a-hammock-hanging-from-a-palm-tree-on-a-beach-QoWDbXGnl3E')}).required(),
    }).required(),
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required(),
        comment:Joi.string().required()
    }).required()
});