export function getUser(req: any, res: any) {
  res.json({
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@email.com",
    id: 1,
  });
}
