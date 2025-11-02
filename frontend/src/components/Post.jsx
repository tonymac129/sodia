import { Link } from "react-router";
import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import Modal from "./Modal";

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

function Post({ postData, userID, posts, setPosts }) {
  const [post, setPost] = useState(postData);
  const [liked, setLiked] = useState(post.likes.includes(userID));
  const [saved, setSaved] = useState(post.saves.includes(userID));
  const [share, setShare] = useState(false);

  async function handleLike(e) {
    e.preventDefault();
    if (!liked) {
      try {
        const newPost = await api.put("/" + post._id, { ...post, likes: [...post.likes, userID] });
        setLiked(true);
        setPost(newPost.data);
      } catch (error) {
        toast.error("Error: failed to like");
      }
    } else {
      try {
        const newPost = await api.put("/" + post._id, {
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

  async function handleSave(e) {
    e.preventDefault();
    if (!saved) {
      try {
        const newPost = await api.put("/" + post._id, { ...post, saves: [...post.saves, userID] });
        setSaved(true);
        setPost(newPost.data);
        toast("Post added to saved", success);
      } catch (error) {
        toast.error("Error: failed to save");
      }
    } else {
      try {
        const newPost = await api.put("/" + post._id, {
          ...post,
          saves: post.saves.filter((user) => user !== userID),
        });
        setSaved(false);
        setPost(newPost.data);
        toast("Post removed from saved", success);
      } catch (error) {
        toast.error("Error: failed to remove from saved");
      }
    }
  }

  async function handleShare(e) {
    e.preventDefault();
    try {
      const newPost = await api.put("/" + postData._id, { ...post, shares: post.shares + 1 });
      setPost(newPost.data);
      navigator.clipboard.writeText(window.location.href + "post/" + postData._id);
      setShare(true);
    } catch (error) {
      toast.error("Error: failed to share post");
    }
  }

  function handleReport(e) {
    e.preventDefault();
    window.open("https://forms.gle/fqF8a2mkZzSM9SA79", "_blank");
  }

  async function handleDelete(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete("/" + postData._id);
        setPosts(posts.filter((post) => post._id !== postData._id));
        toast("Post successfully deleted.", success);
      } catch (error) {
        toast.error("Error: could not delete post");
      }
    }
  }

  return (
    <div>
      <Link to={`/post/${post._id}`} key={post._id} className="post">
        <h2 className="post-title">{post.title}</h2>
        {post.content && <p className="post-content">{post.content}</p>}
        <div className="post-date">{new Date(post.createdAt).toLocaleDateString()}</div>
        <div className="post-btns">
          <div className="post-btn">
            <img
              onClick={(e) => handleLike(e)}
              src={liked ? "/icons/post/liked.svg" : "/icons/post/like.svg"}
              title={`${liked ? "Unlike" : "Like"} post`}
            />
            {post.likes.length}
          </div>
          <div className="post-btn">
            <img
              onClick={(e) => handleSave(e)}
              src={saved ? "/icons/post/saved.svg" : "/icons/post/save.svg"}
              title={`${saved ? "Unsave" : "Save"} post`}
            />
            {post.saves.length}
          </div>
          <div className="post-btn">
            <img onClick={(e) => handleShare(e)} src="/icons/post/share.svg" title="Share post" />
            {post.shares}
          </div>
          <div className="post-btn">
            <img onClick={(e) => handleReport(e)} src="/icons/post/report.svg" title="Report post" />
          </div>
          {userID === post.op && (
            <img src="/icons/post/delete.svg" onClick={(e) => handleDelete(e)} title="Delete post" className="delete-btn" />
          )}
        </div>
      </Link>
      {share && <Modal setShown={setShare} />}
    </div>
  );
}

export default Post;
