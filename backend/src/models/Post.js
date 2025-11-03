import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    op: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
      default: "",
    },
    likes: {
      type: [String],
      default: [],
    },
    shares: {
      type: Number,
      default: 0,
    },
    saves: {
      type: [String],
      default: [],
    },
    comments: {
      type: [Object],
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
