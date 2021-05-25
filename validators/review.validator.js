import Joi from "joi";

//Sets up Review Validations for SQL DB

const ReviewValidationSchema = Joi.object({
    restaurant_id: Joi.number().min(1).required(),
    name: Joi.string().min(2).required(),
    review: Joi.string().min(2).required(),
    rating: Joi.number().min(1).max(5).required(),
});


export const validateReviewData = (data) => {
    let { error, value } = ReviewValidationSchema.validate(data);
    return { err: error, value };
};



