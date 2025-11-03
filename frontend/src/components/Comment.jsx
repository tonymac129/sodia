import { useState } from "react";

function Comment({ comment, userID, likeComment, deleteComment }) {
  const [liked, setLiked] = useState(comment.likes?.includes(userID));

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
      <div className="comment-user">{comment.user}</div>
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
