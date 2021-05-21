export const mockReviewValidator = {
  validateReviewData: jest.fn(),
};

jest.mock("../review.validator", () => {
  return mockReviewValidator;
});
