import { getUser } from "./user";

test("getUser returns user details", () => {
  const res = {
    json: jest.fn(),
  };
  getUser(null, res);
  expect(res.json).toHaveBeenCalledWith({
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@email.com",
    id: 1,
  });
});
