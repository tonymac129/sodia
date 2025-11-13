import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    pfp: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
