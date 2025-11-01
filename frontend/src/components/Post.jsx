import { Link } from "react-router";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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

function Post({ postData, userID }) {
  const [post, setPost] = useState(postData);
  const [liked, setLiked] = useState(post.likes.includes(userID));
  const [saved, setSaved] = useState(false);

  async function handleLike(e) {
    e.preventDefault();
    if (!liked) {
      try {
        const newPost = await axios.put("http://localhost:5001/api/" + post._id, { ...post, likes: [...post.likes, userID] });
        setLiked(true);
        setPost(newPost.data);
      } catch (error) {
        toast.error("Error: failed to like");
      }
    } else {
      try {
        const newPost = await axios.put("http://localhost:5001/api/" + post._id, {
          ...post,
          likes: post.likes.filter((user) => user !== userID),
        });
        setLiked(false);
        setPost(newPost.data);
      } catch (error) {
        toast.error("Error: failed to unlike");
      }
    }
  }

  function handleSave(e) {
    e.preventDefault();
    setSaved(!saved);
    if (saved) {
      toast("Post removed from saved", success);
    } else {
      toast("Post added to saved", success);
    }
  }

  return (
    <Link to={`/post/${post._id}`} key={post._id} className="post">
      <h2 className="post-title">{post.title}</h2>
      {post.content && <p className="post-content">{post.content}</p>}
      <div className="post-date">{new Date(post.createdAt).toLocaleDateString()}</div>
      <div className="post-btns">
        <img
          onClick={(e) => handleLike(e)}
          src={liked ? "/icons/post/liked.svg" : "/icons/post/like.svg"}
          title={`${liked ? "Unlike" : "Like"} post`}
          className="post-btn"
        />
        {post.likes.length}
        <img
          onClick={(e) => handleSave(e)}
          src={saved ? "/icons/post/saved.svg" : "/icons/post/save.svg"}
          title={`${saved ? "Unsave" : "Save"} post`}
          className="post-btn"
        />
        {userID === post.op && <div>u made this bro</div>}
      </div>
    </Link>
  );
}

export default Post;
