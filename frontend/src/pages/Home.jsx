import { useState, useEffect } from "react";
import Post from "../components/Post";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

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

function Home({ posts, fetchPosts, setPosts, user }) {
  const [newPost, setNewPost] = useState("");
  // const [userID, setUserID] = useState(localStorage.getItem("sodia-id") || window.crypto.randomUUID());

  // useEffect(() => {
  //   localStorage.setItem("sodia-id", userID);
  // }, [userID]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPost.trim().length > 0) {
      try {
        await api.post("/", { title: newPost, op: user });
        setPosts([]);
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
            return <Post key={post._id} userID={user} postData={post} posts={posts} setPosts={setPosts} />;
          })
        ) : (
          <div className="message">Oof, the internet looks a bit empty without you. Create a new post below!</div>
        )}
      </div>
      {user ? (
        <form onSubmit={(e) => handleSubmit(e)} className="home-form">
          <input
            type="text"
            value={newPost}
            onInput={(e) => setNewPost(e.target.value)}
            placeholder="Add a post"
            className="home-input"
          />
        </form>
      ) : (
        <div className="normal-message">Sign up to post and join the conversation!</div>
      )}
    </div>
  );
}

export default Home;
