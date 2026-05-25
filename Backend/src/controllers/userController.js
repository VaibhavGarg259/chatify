import User from "../models/User.js";

export const getProfile = (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id }, // ❗ exclude current user
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
