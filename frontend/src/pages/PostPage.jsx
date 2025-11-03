import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import Post from "../components/Post";
import Comment from "../components/Comment";

function PostPage({ posts, setPosts, fetchPosts }) {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [newComment, setNewComment] = useState("");
  const [userID, setUserID] = useState(localStorage.getItem("sodia-id") || window.crypto.randomUUID());
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("sodia-id", userID);
  }, [userID]);

  useEffect(() => {
    if (!id) navigate("/");
    async function fetchPost() {
      try {
        const post = await api.get(id);
        setPost(post.data);
      } catch (error) {
        toast.error("404 post not found");
      }
    }
    fetchPost();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.put(`/${post._id}`, {
        ...post,
        comments: [{ comment: newComment, user: userID, likes: [] }, ...post.comments],
      });
      setPost(response.data);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Error: failed to add comment");
    }
  }

  async function likeComment(ogComment, newComment) {
    let newComments = [...post.comments];
    newComments[newComments.indexOf(ogComment)] = newComment;
    try {
      const newPost = await api.put(post._id, { ...post, comments: newComments });
      setPost(newPost.data);
    } catch (error) {
      toast.error("Error:" + error);
    }
  }

  async function deleteComment(comment) {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        const newPost = await api.put(post._id, {
          ...post,
          comments: post.comments.filter((ogComment) => ogComment !== comment),
        });
        setPost(newPost.data);
        toast.success("Comment deleted successfully");
      } catch (error) {
        toast.error("Error:" + error);
      }
    }
  }

  return (
    <div className="wrap">
      <title>{`${post.title} | Sodia`}</title>
      <div className="home-posts">
        {post._id && <Post postData={post} userID={userID} posts={posts} setPosts={setPosts} page={true} />}
        <div className="post-label">Comments ({post.comments?.length})</div>
        <div className="post-comments">
          {post.comments?.length > 0 ? (
            post.comments.map((comment, i) => {
              return (
                <Comment key={i} comment={comment} userID={userID} likeComment={likeComment} deleteComment={deleteComment} />
              );
            })
          ) : (
            <div className="message">No comments on this post yet. Want to start the conversation?</div>
          )}
        </div>
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className="home-form">
        <input
          type="text"
          value={newComment}
          onInput={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className="home-input"
        />
      </form>
    </div>
  );
}

export default PostPage;
