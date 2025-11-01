import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) navigate("/");
    async function fetchPost() {
      try {
        const post = await axios.get("http://localhost:5001/api/" + id);
        setPost(post.data);
      } catch (error) {
        toast.error("404 post not found");
      }
    }
    fetchPost();
  }, [id]);

  return (
    <div>
      {post.title}
      <br />
      {post.content}
      <br />
      Created on {new Date(post.createdAt).toLocaleDateString()}
    </div>
  );
}

export default Post;
