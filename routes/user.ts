import { Router } from "express";
import userController from "../controllers/user";

// express router
const router = Router();

// View all users
router.get("/users", userController.getUsers);

// Create a new user
router.post("/createUser", userController.postUser);

// View user by id
router.get("/viewUser/:userId", userController.viewUser);

// Delete all users
router.delete("/deleteAllUsers", userController.deleteAllUsers);

// Delete user by id
router.delete("/deleteUser/:userId", userController.deleteUser);

// Update a user's info
router.put("/updateUser/:userId", userController.updateUser);

export default router;
