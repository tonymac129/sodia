import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import User from "./pages/User";
import Nav from "./components/Nav";
import api from "./lib/axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(sessionStorage.getItem("sodia-logged") || "");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const posts = await api.get("/");
      setPosts(posts.data);
    } catch (error) {
      toast.error("404 not found" + error);
    }
  }

  return (
    <BrowserRouter>
      <Nav user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} posts={posts} setPosts={setPosts} fetchPosts={fetchPosts} />} />
        <Route path="/post/" element={<PostPage userID={user} posts={posts} setPosts={setPosts} />} />
        <Route path="/post/:id" element={<PostPage userID={user} posts={posts} setPosts={setPosts} />} />
        <Route path="/user" element={<User userID={user} posts={posts} setPosts={setPosts} />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
