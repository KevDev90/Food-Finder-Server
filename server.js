require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const db = require("./db");
const knex = require("knex");
const morgan = require("morgan");
const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;
const app = express();

const pgdb = knex({
  client: 'pg',
  connection: `${process.env.DATABASE_URL}`,
})
console.log('processenvurl', process.env.DATABASE_URL)
app.set('db', pgdb)
const { NODE_ENV, PORT, IP } = process.env;
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors());
app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "food app server" })
})

// app.get("/healthy",(req,res) => {
//   res.send('ok')
// }) 
// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  console.log('getrequest')
  try {
    //const results = await db.query("select * from restaurants");

    // const restaurantRatingsData = await pgdb.raw(
    //     "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    // );
    const restaurantRatingsData = await pgdb.raw(
      "select * from restaurants");
    console.log('dbqueryresults', restaurantRatingsData)

    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

//Get a Restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const restaurant = await pgdb.raw(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      [req.params.id]
    );
    // select * from restaurants wehre id = req.params.id

    const reviews = await pgdb.raw(
      "select * from reviews where restaurant_id = $1",
      [req.params.id]
    );
    console.log(reviews);

    res.status(200).json({
      status: "succes",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error " + err.message })
  }
});

// Create a Restaurant

app.post("/api/v1/restaurants", async (req, res) => {
  console.log('postreq', req.body);

  try {
    const results = await pgdb.raw(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );
    console.log('dbpostqueryresults', results)

    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error " + err.message })
  }
});

// Update Restaurants

app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await pgdb.raw(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );

    res.status(200).json({
      status: "succes",
      data: {
        retaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error " + err.message })
  }

});

// Delete Restaurant

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = pgdb.raw("DELETE FROM restaurants where id = $1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "sucess",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error " + err.message })
  }
});

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await pgdb.raw(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    console.log(newReview);
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error " + err.message })
  }
});

if (NODE_ENV === "production") {
  app.listen(PORT, IP, () => {
    console.log(`server is up and listening on ${IP}:${PORT}`);
  });
} else {
  app.listen(3001, () => {
    console.log(`server is up and listening on port 3001`);
  });
}
