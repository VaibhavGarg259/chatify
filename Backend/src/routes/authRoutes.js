import express from "express";
import {
  loginUser,
  onboarding,
  registerUser,
  resetPassword,
  updateProfile,
} from "../controllers/authController.js";
import upload from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forget", resetPassword);
router.post("/onboard", protect, upload.single("profilePic"), onboarding);
router.put("/update", protect, upload.single("profilePic"), updateProfile);
router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
