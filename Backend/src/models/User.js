import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
      sparse: true,
    },
    PhoneNo: {
      type: String,
      // required: true,
      // unique: true,
      // sparse: true,
      minlength: 10,
      maxlength: 10,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    Bio: {
      type: String,
      default: "",
    },
    ProfilePic: {
      type: String,
      default: "",
    },
    City: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    Dost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  { timestamps: true },
);

//pre hook
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);

//     next();
//   } catch (error) {
//     console.log("HASH ERROR:", error);
//     next(error);
//   }
// });

userSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.log("Hash Error:", err);
    throw err; // ✔️ important
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(
    enteredPassword,
    this.password,
  );
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

export default User;
