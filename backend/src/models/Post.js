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
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
