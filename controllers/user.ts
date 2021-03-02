import { Request, Response } from "express";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";

// User Type
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
}

// Database Type
interface Database {
  users: User[];
}

// lowdb
const adapter = new FileSync<Database>("db.json");
const db = low(adapter);

// set default when json is empty
db.defaults({ users: [] }).write();

// Get all users
const getUsers = (req: Request, res: Response) => {
  // get all users from db
  const userData = db.get("users");
  // response sent with status 404 when user array is empty
  if (userData.isEmpty().value()) {
    return res.status(404).json({ message: "No Users Found!" });
  }
  // response sent with status 200 when all users fetched successfully
  res.status(200).json({
    users: userData,
    message: "Fetched user data successfully!",
  });
};

// Create post
const postUser = (req: Request, res: Response) => {
  // get all users from db
  const dbData = db.get("users");
  // create id for new user
  const userId = new Date().toISOString();
  // append userId to incoming request data and store in userData
  const userData = {
    ...req.body,
    id: userId,
  };
  // add new user data in db
  dbData.push(userData).write();
  // response sent with status 201 when user created successfully
  res.status(201).json({
    user: { id: userId, ...req.body },
    message: "User created successfully!",
  });
};

// View User by Id
const viewUser = (req: Request<{ userId: string }>, res: Response) => {
  // extract user id from request parameter
  const userId = req.params.userId;
  // store user matching userId with id
  const user = db.get("users").find({ id: userId }).value();
  // response sent with status 404 when user not found
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  // response sent with status 200 when user fetched successfully
  res.status(200).json({ data: user, message: "Fetched User Successfully!" });
};

// Delete all users
const deleteAllUsers = (req: Request, res: Response) => {
  // get all users from db
  const userData = db.get("users");
  // response sent with status 404 when user array is empty
  if (userData.isEmpty().value()) {
    return res.status(404).json({ message: "No Users Found!" });
  }
  // set db to empty array
  db.set("users", []).write();
  // response sent with status 200 when all users deleted successfully
  res.status(200).json({ message: "Deleted all users successfully!" });
};

// Delete user by id
const deleteUser = (req: Request, res: Response) => {
  // extract user id from request parameter
  const userId = req.params.userId;
  // store user matching userId with id
  const userData = db.get("users").find({ id: userId }).value();
  // response sent with status 404 when user with requested id doesn't exist
  if (!userData) {
    return res.status(404).json({ message: "No such user exists!" });
  }
  // remove user with id matching userId from db
  db.get("users").remove({ id: userId }).write();
  // response sent with status 200 when user deleted successfully
  res.status(200).json({ message: "Deleted user successfully!" });
};

// update user
const updateUser = (req: Request, res: Response) => {
  // extract user id from request parameter
  const userId = req.params.userId;
  // store user with id matching userId
  const userData = db.get("users").find({ id: userId }).value();
  // response sent with status 404 when user with requested id doesn't exist
  if (!userData) {
    return res.status(404).json({ message: "No such user exists!" });
  }
  // update user data with incoming request data
  db.get("users")
    .find({ id: userId })
    .assign({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobile: req.body.mobile,
      email: req.body.email,
      city: req.body.city,
    })
    .write();
  // response sent with status 200 when user user updated successfully
  res.status(200).json({
    message: "User updated successfully!",
  });
};

export default {
  getUsers,
  postUser,
  viewUser,
  deleteAllUsers,
  updateUser,
  deleteUser,
};
