import { useState, useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { pfps } from "../assets/assets";

function Comment({ comment, userID, likeComment, deleteComment }) {
  const [liked, setLiked] = useState(comment.likes?.includes(userID));
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const newUser = await api.get(`/user/${comment.user}`);
        setUserData(newUser.data);
      } catch (error) {
        toast.error("Error: " + error);
      }
    }
    fetchUser();
  }, [comment]);

  useEffect(() => {
    setLiked(comment.likes?.includes(userID));
  }, [userID]);

  function handleLike() {
    let newComment;
    if (liked) {
      newComment = { ...comment, likes: comment.likes.filter((like) => like !== userID) };
    } else {
      let prev = comment.likes ? comment.likes : [];
      newComment = { ...comment, likes: [...prev, userID] };
    }
    likeComment(comment, newComment);
    setLiked(!liked);
  }

  return (
    <div className="post-comment">
      <div className="comment-info">
        <span className="comment-user">
          <img src={pfps.pfps[userData.pfp]} />@{comment.user}
        </span>{" "}
      </div>
      <div className="comment-content">{comment.comment}</div>
      <div className="post-btns">
        <div className="post-btn comment-btn">
          <img
            onClick={handleLike}
            src={`/icons/post/like${liked ? "d" : ""}.svg`}
            title={`Like${liked ? "d" : ""} comment`}
            className="no-inverse"
          />
          {comment.likes?.length ? comment.likes.length : 0}
        </div>
        {comment.user === userID && (
          <div className="post-btn comment-btn" onClick={() => deleteComment(comment)}>
            <img src="/icons/post/delete.svg" title="Delete comment" className="delete-btn no-inverse" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
