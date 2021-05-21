// make sure to import mocks first
import { mockRestaurant } from "../models/__mocks__/Restaurant";
import { mockReview } from "../models/__mocks__/Review";
import { mockRestaurantValidator } from "../validators/__mocks__/restaurant.validator";
import { mockReviewValidator } from "../validators/__mocks__/review.validator";
// do not remove this even though we don't use it it's still required to mock the database connection
import { createConnection } from "../utils/dbconnection.util";
import supertest from "supertest";

jest.mock("../utils/dbconnection.util", () => ({
  createConnection: jest.fn().mockImplementation(() => Promise.resolve()),
}));

// and the system under test as last
import { createApp } from "./server";

describe("api routes", () => {
  const app = createApp();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /api/v1/restaurants", () => {
    it("responds with 200", async () => {
      const data = [{ id: 1 }];
      mockRestaurant.findAll.mockImplementation(() => Promise.resolve(data));

      const response = await supertest(app).get("/api/v1/restaurants");

      expect(response.status).toBe(200);
      expect(mockRestaurant.findAll).toBeCalled();
      expect(response.body).toEqual({
        status: "success",
        results: 1,
        data,
      });
    });

    it("responds with 500 on error", async () => {
      mockRestaurant.findAll.mockImplementation(() => {
        throw new Error("failed");
      });

      const response = await supertest(app).get("/api/v1/restaurants");

      expect(response.status).toBe(500);
      expect(mockRestaurant.findAll).toBeCalled();
      expect(response.body).toEqual({ message: "failed" });
    });
  });

  describe("GET /api/v1/restaurants/:id", () => {
    it("responds with 200 when found", async () => {
      const data = {
        id: 1,
      };
      mockRestaurant.findByPk.mockImplementation(() => Promise.resolve(data));

      const response = await supertest(app).get("/api/v1/restaurants/1");

      expect(response.status).toBe(200);
      expect(mockRestaurant.findByPk).toBeCalled();
      expect(response.body).toEqual({
        status: "success",
        data,
      });
    });

    it("responds with 404 when not found", async () => {
      mockRestaurant.findByPk.mockImplementation(() => Promise.resolve(null));

      const response = await supertest(app).get("/api/v1/restaurants/1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "restaurant does not exist" });
      expect(mockRestaurant.findByPk).toBeCalled();
    });

    it("responds with 500 on error", async () => {
      mockRestaurant.findByPk.mockImplementation(() => {
        throw new Error("failed");
      });

      const response = await supertest(app).get("/api/v1/restaurants/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error failed" });
      expect(mockRestaurant.findByPk).toBeCalled();
    });
  });

  describe("POST /api/v1/restaurants", () => {
    it("responds with 201 when created", async () => {
      mockRestaurantValidator.validateRestaurantData.mockImplementation(() => ({
        err: null,
        value: jest.fn(),
      }));

      const data = {
        id: 1,
      };
      mockRestaurant.create.mockImplementation(() => Promise.resolve(data));

      const response = await supertest(app).post("/api/v1/restaurants");

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: "success",
        data: {
          restaurant: data,
        },
      });
      expect(mockRestaurantValidator.validateRestaurantData).toBeCalled();
      expect(mockRestaurant.create).toBeCalled();
    });

    it("responds with 400 if request is not valid", async () => {
      const err = { details: [{ message: "Some Error" }] };

      mockRestaurantValidator.validateRestaurantData.mockImplementation(() => ({
        err,
        value: jest.fn(),
      }));

      const response = await supertest(app).post("/api/v1/restaurants");

      expect(response.status).toBe(400);
      expect(mockRestaurantValidator.validateRestaurantData).toBeCalled();
      expect(mockRestaurant.create).not.toBeCalled();
      expect(response.body).toEqual({
        message: err.details[0].message,
        data: err.details,
      });
    });

    it("responds with 500 on error", async () => {
      mockRestaurantValidator.validateRestaurantData.mockImplementation(() => ({
        err: null,
        value: jest.fn(),
      }));
      mockRestaurant.create.mockImplementation(() => {
        throw new Error("failed");
      });

      const response = await supertest(app).post("/api/v1/restaurants");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error failed" });
      expect(mockRestaurant.create).toBeCalled();
    });
  });

  describe("PUT /api/v1/restaurants/:id", () => {
    it("responds with 200 when update", async () => {
      mockRestaurantValidator.validateRestaurantUpdateData.mockImplementation(
        () => ({
          err: null,
          value: jest.fn(),
        })
      );

      const restaurant = {
        id: 1,
      };
      const update = jest
        .fn()
        .mockImplementation(() => Promise.resolve(restaurant));
      mockRestaurant.findByPk.mockImplementation(() =>
        Promise.resolve({
          update,
        })
      );

      const response = await supertest(app).put("/api/v1/restaurants/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        data: {
          restaurant,
        },
      });
      expect(mockRestaurantValidator.validateRestaurantUpdateData).toBeCalled();
      expect(mockRestaurant.findByPk).toBeCalled();
      expect(update).toBeCalled();
    });

    it("responds with 400 if request is not valid", async () => {
      const err = { details: [{ message: "Some Error" }] };

      mockRestaurantValidator.validateRestaurantUpdateData.mockImplementation(
        () => ({
          err,
          value: jest.fn(),
        })
      );

      const response = await supertest(app).put("/api/v1/restaurants/1");

      expect(response.status).toBe(400);
      expect(mockRestaurantValidator.validateRestaurantUpdateData).toBeCalled();
      expect(mockRestaurant.findByPk).not.toBeCalled();
      expect(response.body).toEqual({
        message: err.details[0].message,
        data: err.details,
      });
    });

    it("responds with 400 if restaurant not found", async () => {
      mockRestaurantValidator.validateRestaurantUpdateData.mockImplementation(
        () => ({
          err: null,
          value: jest.fn(),
        })
      );

      mockRestaurant.findByPk.mockImplementation(() => Promise.resolve(null));

      const response = await supertest(app).put("/api/v1/restaurants/1");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Restaurant not found" });
      expect(mockRestaurantValidator.validateRestaurantUpdateData).toBeCalled();
      expect(mockRestaurant.findByPk).toBeCalled();
      expect(response.body).toEqual({
        message: "Restaurant not found",
      });
    });

    it("responds with 500 on error", async () => {
      mockRestaurantValidator.validateRestaurantUpdateData.mockImplementation(
        () => ({
          err: null,
          value: jest.fn(),
        })
      );

      const update = jest.fn().mockImplementation(() => {
        throw new Error("failed");
      });
      mockRestaurant.findByPk.mockImplementation(() =>
        Promise.resolve({
          update,
        })
      );

      const response = await supertest(app).put("/api/v1/restaurants/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error failed" });
      expect(mockRestaurantValidator.validateRestaurantUpdateData).toBeCalled();
      expect(mockRestaurant.findByPk).toBeCalled();
      expect(update).toBeCalled();
      expect(response.body).toEqual({
        message: "Server error failed",
      });
    });
  });

  describe("DELETE /api/v1/restaurants/:id", () => {
    it("returns 200 when restaurant deleted", async () => {
      mockRestaurant.findByPk.mockImplementation(() => Promise.resolve({}));
      mockReview.destroy.mockImplementation(() => Promise.resolve());
      mockRestaurant.destroy.mockImplementation(() => Promise.resolve({}));

      const response = await supertest(app).delete("/api/v1/restaurants/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "restaurant",
      });
      expect(mockRestaurant.findByPk).toBeCalled();
      expect(mockReview.destroy).toBeCalled();
      expect(mockRestaurant.destroy).toBeCalled();
    });

    it("returns 404 when restaurant not found", async () => {
      mockRestaurant.findByPk.mockImplementation(() => Promise.resolve(null));

      const response = await supertest(app).delete("/api/v1/restaurants/1");

      expect(response.status).toBe(404);
      expect(mockRestaurant.findByPk).toBeCalled();
      expect(response.body).toEqual({ message: "restaurant does not exist" });
      expect(mockReview.destroy).not.toBeCalled();
      expect(mockRestaurant.destroy).not.toBeCalled();
    });

    it("returns 400 when restaurant cannot be deleted", async () => {
      mockRestaurant.findByPk.mockImplementation(() => Promise.resolve({}));
      mockReview.destroy.mockImplementation(() => Promise.resolve());
      mockRestaurant.destroy.mockImplementation(() => Promise.resolve(null));

      const response = await supertest(app).delete("/api/v1/restaurants/1");

      expect(response.status).toBe(400);
      expect(mockRestaurant.findByPk).toBeCalled();
      expect(mockReview.destroy).toBeCalled();
      expect(mockRestaurant.destroy).toBeCalled();
      expect(response.body).toEqual({ message: "cannot delete restaurant" });
    });

    it("returns 500 on error", async () => {
      mockRestaurant.findByPk.mockImplementation(() => {
        throw new Error("failed");
      });

      const response = await supertest(app).delete("/api/v1/restaurants/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error failed" });
    });
  });

  describe("POST /api/v1/restaurants/:id/addReview", () => {
    it("returns 201 when review created", async () => {
      mockReviewValidator.validateReviewData.mockImplementation(() => ({
        err: null,
        value: jest.fn(),
      }));

      const review = {
        id: 1,
      };
      mockReview.create.mockImplementation(() => Promise.resolve(review));

      const response = await supertest(app).post(
        "/api/v1/restaurants/1/addReview"
      );

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: "success",
        data: {
          review,
        },
      });
      expect(mockReviewValidator.validateReviewData).toBeCalled();
      expect(mockReview.create).toBeCalled();
    });

    it("returns 400 when request invalid", async () => {
      const err = { details: [{ message: "Some Error" }] };

      mockReviewValidator.validateReviewData.mockImplementation(() => ({
        err,
        value: jest.fn(),
      }));

      const response = await supertest(app).post(
        "/api/v1/restaurants/1/addReview"
      );

      expect(response.status).toBe(400);
      expect(mockReviewValidator.validateReviewData).toBeCalled();
      expect(mockReview.create).not.toBeCalled();
      expect(response.body).toEqual({
        message: err.details[0].message,
        data: err.details,
      });
    });

    it("returns 500 on error", async () => {
      mockReviewValidator.validateReviewData.mockImplementation(() => ({
        err: null,
        value: jest.fn(),
      }));

      mockReview.create.mockImplementation(() => {
        throw new Error("failed");
      });

      const response = await supertest(app).post(
        "/api/v1/restaurants/1/addReview"
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Server error failed",
      });
    });
  });
});



