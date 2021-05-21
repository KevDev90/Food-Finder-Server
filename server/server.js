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
// const db = require("./db");
// const knex = require("knex");
const morgan = require("morgan");
// const pg = require('pg');
// pg.defaults.ssl = process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;

const { NODE_ENV, PORT, IP } = process.env;

export const createApp = () => {
  const app = express();
  createConnection(sequelize);

  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });

  // const pgdb = knex({
  //   client: 'pg',
  //   connection: `${process.env.DATABASE_URL}`,
  // })
  // console.log('processenvurl', process.env.DATABASE_URL)
  // app.set('db', pgdb)
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

  // app.get("/healthy",(req,res) => {
  //   res.send('ok')
  // })
  // Get all Restaurants
  app.get("/api/v1/restaurants", async (req, res) => {
    console.log("getrequest");
    try {
      //const results = await db.query("select * from restaurants");

      // const restaurantRatingsData = await pgdb.raw(
      //     "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
      // );
      // const restaurantRatingsData = await pgdb.raw(
      //   "select * from restaurants");
      // console.log('dbqueryresults', restaurantRatingsData)
      const restaurants = await Restaurant.findAll();

      res.status(200).json({
        status: "success",
        results: restaurants.length,
        data: restaurants,
        // results: restaurantRatingsData.rows.length,
        // data: {
        //   restaurants: restaurantRatingsData.rows,
        // },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  });

  //Get a Restaurant
  app.get("/api/v1/restaurants/:id", async (req, res) => {
    try {
      // const restaurant = await pgdb.raw(
      //   "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      //   [req.params.id]
      // );
      // // select * from restaurants wehre id = req.params.id

      // const reviews = await pgdb.raw(
      //   "select * from reviews where restaurant_id = $1",
      //   [req.params.id]
      // );
      //console.log(reviews);
      let { id } = req.params;
      let restaurant = await Restaurant.findByPk(id, {
        include: "reviews",
      });
      if (!restaurant)
        return res.status(404).json({ message: "restaurant does not exist" });
      return res.status(200).json({
        status: "success",
        data: restaurant,
        // data: {
        //   restaurant: restaurant.rows[0],
        //   reviews: reviews.rows,
        // },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error " + err.message });
    }
  });

  // Create a Restaurant

  app.post("/api/v1/restaurants", async (req, res) => {
    console.log("postreq", req.body);

    try {
      let { err, value } = validateRestaurantData(req.body);
      if (err)
        return res
          .status(400)
          .json({ message: err.details[0].message, data: err.details });
      // const results = await pgdb.raw(
      //   "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      //   [req.body.name, req.body.location, req.body.price_range]
      // );
      // console.log('dbpostqueryresults', results)
      const restaurant = await Restaurant.create(value);

      res.status(201).json({
        status: "success",
        data: {
          restaurant,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error " + err.message });
    }
  });

  // Update Restaurants

  app.put("/api/v1/restaurants/:id", async (req, res) => {
    try {
      // const results = await pgdb.raw(
      //   "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      //   [req.body.name, req.body.location, req.body.price_range, req.params.id]
      // );
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
      console.log(err);
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
      console.log(err);
      return res.status(500).json({ message: "Server error " + err.message });
    }
  });

  app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
    try {
      // const newReview = await pgdb.raw(
      //   "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      //   [req.params.id, req.body.name, req.body.review, req.body.rating]
      // );
      // console.log(newReview);
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
      console.log(err);
      return res.status(500).json({ message: "Server error " + err.message });
    }
  });

  return app;
};
