import express from "express";
import protect from "../middleware/authMiddleware.js";
// import upload from "../middleware/upload.js";
import { getAllUsers, getProfile } from "../controllers/userController.js";

const router = express.Router();

//protected route
router.get("/profile", protect, getProfile);
router.get("/users", protect, getAllUsers);

export default router;
