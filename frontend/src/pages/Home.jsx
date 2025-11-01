import { useState, useEffect } from "react";
import Post from "../components/Post";
import toast from "react-hot-toast";
import axios from "axios";

const success = {
  icon: "✅",
  style: {
    backgroundColor: "var(--primary-bg)",
    borderRadius: "5px",
    color: "var(--secondary-text)",
    padding: "10px 20px",
    border: "2px solid var(--primary-border)",
  },
};

const error = {
  ...success,
  icon: "⚠️",
};

function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [userID, setUserID] = useState(localStorage.getItem("sodia-id") || window.crypto.randomUUID());

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    localStorage.setItem("sodia-id", userID);
  }, [userID]);

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
        await axios.post("http://localhost:5001/api", { title: newPost, op: userID });
        fetchPosts();
        setNewPost("");
        toast("Post created successfully!", success);
      } catch (error) {
        toast.error("500 internal server error");
      }
    } else {
      toast("Please enter a valid post!", error);
    }
  }

  return (
    <div className="wrap">
      <div className="home-posts">
        {posts.length > 0 ? (
          posts.map((post) => {
            return <Post userID={userID} postData={post} />;
          })
        ) : (
          <div className="message">Oof, the internet looks a bit empty without you. Create a new post below!</div>
        )}
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
