import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const posts = await axios.get("http://localhost:5001/api");
        setPosts(posts.data);
      } catch (error) {
        toast.error("404 not found");
      }
    }
    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => {
        return <div key={post._id}>{post.title}</div>;
      })}
      <Toaster />
    </div>
  );
}

export default App;
