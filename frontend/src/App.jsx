import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import Nav from "./components/Nav";
import api from "./lib/axios";

function App() {
  const [posts, setPosts] = useState([]);

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
      <Nav />
      <Routes>
        <Route path="/" element={<Home posts={posts} setPosts={setPosts} fetchPosts={fetchPosts} />} />
        <Route path="/post/" element={<PostPage posts={posts} setPosts={setPosts} fetchPosts={fetchPosts} />} />
        <Route path="/post/:id" element={<PostPage posts={posts} setPosts={setPosts} fetchPosts={fetchPosts} />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
