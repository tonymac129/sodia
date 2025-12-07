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
      required: false,
    },
    pfp: {
      type: mongoose.Schema.Types.Mixed,
      default: 0,
    },
    bio: {
      type: String,
      default: "",
    },
    saved: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    followers: {
      type: [String],
      default: [],
    },
    email: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
