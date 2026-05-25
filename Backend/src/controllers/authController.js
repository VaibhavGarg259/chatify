import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js"; //onboarding file
import streamifier from "streamifier"; //onboarding file

// signup
export const registerUser = async (req, res) => {
  try {
    const { FullName, email, PhoneNo, password } = req.body;

    if (!FullName || !password || (!email && !PhoneNo)) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // check user
    const userExist = await User.findOne({
      $or: [{ email }, { PhoneNo }],
    });
    if (userExist)
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    // create user
    const user = await User.create({
      FullName,
      email: email || null,
      PhoneNo: PhoneNo || null,
      password,
    });
    // token generate

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // cookies me save
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, // production में true
    //   sameSite: "lax",
    // });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (https)
      sameSite: "lax",
    });

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        FullName: user.FullName,
        email: user.email,
        PhoneNo: user.PhoneNo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login
export const loginUser = async (req, res) => {
  try {
    const { email, PhoneNo, password } = req.body;

    if ((!email && !PhoneNo) || !password) {
      return res
        .status(400)
        .json({ message: "Email or PhoneNo and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email }, { PhoneNo }],
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid email or phoneNo  or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //   create taken
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // const token = jwt.sign(  { id: user._id },  process.env.JWT_SECRET,  { expiresIn: "7d" });
    // console.log(user);

    // cookies me save
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, // dev
    //   sameSite: "lax",
    //   path: "/", // ✅ add this
    // });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (https)
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        FullName: user.FullName,
        email: user.email,
        PhoneNo: user.PhoneNo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// forget password
export const resetPassword = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }
    const passhast = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        email: email,
      },
      {
        $set: {
          password: passhast,
        },
      },
    );

    await user.save();
    return res.status(200).json({
      message: "Password has been reset",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something error" });
  }
};

// export const onboarding = async (req, res) => {
//   try {
//     // console.log("FILE: " + req.file);
//     // console.log("FILE:");
//     // console.dir(req.file, { depth: null });
//     // console.log("FILE:", req.file);
//     // console.log("PATH:", req.file?.path);
//     console.log("TYPE:", typeof req.file);
//     const { bio, city } = req.body;
//     const user = await User.findById(req.user._id); //auth middleware
//     if (!user) return res.status(404).json({ message: "User not found" });

//     //cloudinary URL
//     if (req.file) {
//       user.ProfilePic = req.file.path;
//     }
//     user.Bio = bio;
//     user.City = city;
//     user.isOnboarded = true;
//     await user.save();
//     res.json({
//       message: "Profile updated",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const onboarding = async (req, res) => {
  try {
    const { bio, city } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      try {
        // 🔥 buffer → stream → cloudinary
        const streamUpload = async () => {
          return await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "ProfilePic" },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              },
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };

        // const result = await streamUpload();
        const result = await streamUpload();

        user.ProfilePic = result.secure_url;
      } catch (error) {
        console.log("ERROR:", error);
        return res.status(500).json({
          message: error.message || "Something went wrong",
        });
      }
    }

    user.Bio = bio;
    user.City = city;
    user.isOnboarded = true;

    await user.save();

    res.json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.log("ERROR:", error); // 🔥 important
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.FullName = req.body.FullName || user.FullName;
    user.Bio = req.body.Bio || user.Bio;
    user.City = req.body.City || user.City;

    // 🔥 CLOUDINARY UPLOAD
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "profilePic" },
        async (error, result) => {
          if (error) throw error;

          user.ProfilePic = result.secure_url; // ✅ cloud URL
          await user.save();

          return res.json({
            message: "Profile updated",
            user,
          });
        },
      );

      result.end(req.file.buffer);
      return;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
