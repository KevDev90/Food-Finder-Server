export const mockReview = {
  belongsTo: jest.fn(),
  destroy: jest.fn(),
  create: jest.fn(),
};

jest.mock("../Review", () => {
  return {
    createReview: () => mockReview,
  };
});
