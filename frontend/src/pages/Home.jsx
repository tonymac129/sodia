import { useState, useEffect } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const posts = await axios.get("http://localhost:5001/api");
      setPosts(posts.data);
    } catch (error) {
      toast.error("404 not found");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPost.trim().length > 0) {
      try {
        await axios.post("http://localhost:5001/api", { title: newPost });
        fetchPosts();
        setNewPost("");
        toast.success("Post created successfully!");
      } catch (error) {
        toast.error("500 internal server error");
      }
    } else {
      toast.error("Please enter a valid post!");
    }
  }

  return (
    <div className="wrap">
      <div className="home-posts">
        {posts.map((post) => {
          return (
            <Link to={`/post/${post._id}`} key={post._id}>
              {post.title}
            </Link>
          );
        })}
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className="home-form">
        <input
          type="text"
          value={newPost}
          onInput={(e) => setNewPost(e.target.value)}
          placeholder="Add a post"
          className="home-input"
        />
      </form>
    </div>
  );
}

export default Home;
