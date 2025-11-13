import Post from "../models/Post.js";

export async function getAllPosts(_, res) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error:" + error);
  }
}

export async function createPost(req, res) {
  try {
    const { title, content, op } = req.body;
    const newPost = new Post({ title, content, op });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.log("Error:" + error);
  }
}

export async function getPost(req, res) {
  try {
    const post = await Post.findById(req.params.postid);
    res.status(200).json(post);
  } catch (error) {
    console.log("Error:" + error);
  }
}

export async function deletePost(req, res) {
  try {
    const post = await Post.findByIdAndDelete(req.params.postid);
    if (!post) {
      res.status(404).json({ message: "404 Post not found!" });
    }
    res.status(200).json({ message: "Post successfully deleted" });
  } catch (error) {
    console.log("Error:" + error);
  }
}

export async function updatePost(req, res) {
  try {
    const { title, content, likes, op, shares, saves, comments } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.postid,
      { title, content, likes, op, shares, saves, comments },
      { new: true }
    );
    if (!post) {
      res.status(404).json({ message: "404 Post not found!" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log("Error:" + error);
  }
}
