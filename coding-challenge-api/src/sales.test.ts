import { getSales } from "./sales";

test("getSales returns user details", () => {
  const res = {
    json: jest.fn(),
  };
  getSales(null, res);
  expect(res.json).toHaveBeenCalledWith({
    totalPages: 0,
    sales: [],
   
  });
});
