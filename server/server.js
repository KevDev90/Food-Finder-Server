require("dotenv").config();
const express = require("express");
import { createRestaurant } from "../models/Restaurant";
import { createReview } from "../models/Review";
import { validateReviewData } from "../validators/review.validator";
import {
  validateRestaurantData,
  validateRestaurantUpdateData,
} from "../validators/restaurant.validator";
import { createConnection, sequelize } from "../utils/dbconnection.util";
const cors = require("cors");
const morgan = require("morgan");
const { NODE_ENV, PORT, IP } = process.env;

export const createApp = () => {
  const app = express();
  createConnection(sequelize);

  const morganOption = NODE_ENV === "production" ? "tiny" : "common";

  app.use(morgan(morganOption));
  app.use(cors());
  app.options("*", cors());
  app.use(express.json());

  const Restaurant = createRestaurant();
  const Review = createReview();

  Restaurant.hasMany(Review, { as: "reviews", foreignKey: "restaurant_id" });
  Review.belongsTo(Restaurant, {
    as: "restaurant",
    foreignKey: "restaurant_id",
  });

  app.get("/", (req, res) => {
    return res.status(200).json({ message: "food app server" });
  });

  // Get all Restaurants
  app.get("/api/v1/restaurants", async (req, res) => {
    try {

      const restaurants = await Restaurant.findAll();

      res.status(200).json({
        status: "success",
        results: restaurants.length,
        data: restaurants,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });

  //Get a Restaurant
  app.get("/api/v1/restaurants/:id", async (req, res) => {
    try {
      let { id } = req.params;
      let restaurant = await Restaurant.findByPk(id, {
        include: "reviews",
      });
      if (!restaurant)
        return res.status(404).json({ message: "restaurant does not exist" });
      return res.status(200).json({
        status: "success",
        data: restaurant,
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error " + err.message });
    }
  });

  // Create a Restaurant

  app.post("/api/v1/restaurants", async (req, res) => {
    try {
      let { err, value } = validateRestaurantData(req.body);
      if (err)
        return res
          .status(400)
          .json({ message: err.details[0].message, data: err.details });
      const restaurant = await Restaurant.create(value);

      res.status(201).json({
        status: "success",
        data: {
          restaurant,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error " + err.message });
    }
  });

  // Update Restaurants

  app.put("/api/v1/restaurants/:id", async (req, res) => {
    try {
      const { err, value } = validateRestaurantUpdateData(req.body);
      if (err)
        return res
          .status(400)
          .json({ message: err.details[0].message, data: err.details });
      let { id } = req.params;
      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant)
        return res.status(400).json({
          message: "Restaurant not found",
        });
      const updatedRestaurant = await restaurant.update(value);
      res.status(200).json({
        status: "success",
        data: {
          restaurant: updatedRestaurant,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error " + err.message });
    }
  });

  // Delete Restaurant

  app.delete("/api/v1/restaurants/:id", async (req, res) => {
    try {
      let restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant)
        return res.status(404).json({ message: "restaurant does not exist" });
      let destroyedReviews = await Review.destroy({
        where: {
          restaurant_id: restaurant.id,
        },
      });
      const deletedRestaurant = await Restaurant.destroy({
        where: { id: req.params.id },
      });
      if (!deletedRestaurant)
        return res.status(400).json({ message: "cannot delete restaurant" });
      res.status(200).json({
        message: "restaurant",
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error " + err.message });
    }
  });

  app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
    try {
      const { err, value } = validateReviewData(req.body);
      if (err)
        return res
          .status(400)
          .json({ message: err.details[0].message, data: err.details });
      const review = await Review.create(value);
      res.status(201).json({
        status: "success",
        data: {
          review,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error " + err.message });
    }
  });

  return app;
};
