export const mockRestaurantValidator = {
  validateRestaurantData: jest.fn(),
  validateRestaurantUpdateData: jest.fn(),
};

jest.mock("../restaurant.validator", () => {
  return mockRestaurantValidator;
});
