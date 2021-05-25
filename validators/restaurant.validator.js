import Joi from "joi";
//Sets up Restaurant Validations for SQL DB

const RestaurantValidationSchema = Joi.object({
    location: Joi.string().min(2).required(),
    name: Joi.string().min(2).required(),
    price_range: Joi.number().min(1).max(5).required(),
});

const RestaurantUpdateValidationSchema = Joi.object({
    location: Joi.string().min(2),
    name: Joi.string().min(2),
    price_range: Joi.number().min(1).max(5),
});

export const validateRestaurantData = (data) => {
    let { error, value } = RestaurantValidationSchema.validate(data);
    return { err: error, value };
};

export const validateRestaurantUpdateData = (data) => {
    let { error, value } = RestaurantUpdateValidationSchema.validate(data);
    return { err: error, value };
};