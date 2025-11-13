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
  const [newContent, setNewContent] = useState("");
  const [showContent, setShowContent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPost.trim().length > 0) {
      try {
        await api.post("/", { title: newPost, content: newContent, op: user });
        setPosts([]);
        fetchPosts();
        setNewPost("");
        setNewContent("");
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
          <img
            src="/icons/ui/caret.svg"
            className={`home-caret ${showContent ? "caret-open" : ""}`}
            onClick={() => setShowContent(!showContent)}
            title={`Show ${showContent ? "less" : "more"}`}
          />
          <input
            type="text"
            value={newPost}
            onInput={(e) => setNewPost(e.target.value)}
            className="home-input"
            placeholder={showContent ? "Post title" : "Add a post"}
          />
          {showContent && (
            <input
              type="text"
              value={newContent}
              onInput={(e) => setNewContent(e.target.value)}
              className="home-input"
              placeholder="Post content"
            />
          )}
          <button type="submit" style={{ display: "none" }}></button>
        </form>
      ) : (
        <div className="normal-message">Sign up to post and join the conversation!</div>
      )}
    </div>
  );
}

export default Home;
