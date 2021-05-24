# Food Finder - API

Live version: (https://food-finder-client-kevdev90.vercel.app/)

## Introduction 

Your one stop application for rating and leaving reviews about Restaurants you've visited!

Enter a Restaurant name and location in the text inputs, and then select a price range. After that, click the add button after all the information is filled out to add the Restaurant to the table!

On a mobile view you can scroll horizontally to see the full list of Restaurants!

You can also Edit and Delete a Restaurant after creating it through the buttons on the Restaurant row!

After creating a Restaurant you can click anywhere on that Restaurants row in the table to write a review and rate that particular Restaurant!

Bon Appetit!

## Technologies

* Testing 
  * Supertest (integration) 
  * Jest
* Database 
  * Postgres
  * Sequelize
* Node and Express  
  * RESTful API 

  
## Production 

Deployed via Heroku

## API Endpoints


### Restaurants Table Router
```
- /api/v1/restaurants
- - GET - gets all restaurants 
- - POST - creates a new restaurant
```

### Restaurants/:restaurantId Router 
```
- /api/v1/restaurants/:id
- - GET - gets restaurants by id 
- - DELETE - deletes restaurants by id 
- - PUT - updates restaurants by id
```

### Reviews Router
```
- /api/v1/restaurants/:id/addReview
- - POST - creates a new review
```