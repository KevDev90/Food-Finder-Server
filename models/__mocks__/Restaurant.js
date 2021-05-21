export const mockRestaurant = {
  hasMany: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
};

jest.mock("../Restaurant", () => {
  return {
    createRestaurant: () => mockRestaurant,
  };
});
