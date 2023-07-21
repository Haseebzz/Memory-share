import "../css/Modal.css";
import axios from 'axios';
import { useState } from "react";

export default function Modal({
  memory,
  comments,
  setShowModal,
  userId,
  handleToggleLike,
  handleToggleDislike
}) {
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const username = window.localStorage.username;

  window.addEventListener("click", (e) => {
    if (e.target.id === "memory-modal") {
      setShowModal(false);
      document.querySelector("body").style.overflow = "auto";
    }
  });

  const handleCommentToggleLike = async (commentId) => {
    try {
      const comment = comments.find((c) => c._id === commentId);
      if (comment.likes.includes(userId)) {
        await axios.post(`http://localhost:4000/comment/${commentId}/unlike/${userId}`);
      } else {
        await axios.post(`http://localhost:4000/comment/${commentId}/like/${userId}`);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentToggleDislike = async (commentId) => {
    try {
      const comment = comments.find((c) => c._id === commentId);
      if (comment.dislikes.includes(userId)) {
        await axios.post(`http://localhost:4000/comment/${commentId}/undislike/${userId}`);
      } else {
        await axios.post(`http://localhost:4000/comment/${commentId}/dislike/${userId}`);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const handleCommentSubmit = async (memoryId) => {
    try {
      const response = await axios.post(`http://localhost:4000/comment/${memoryId}`, {
        username: username,
        comment: newComment,
      });
      const createdComment = response.data;
      console.log('New comment:', createdComment);
      setNewComment('');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:4000/comment/${commentId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCommentUpdate = async (e, commentId) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/comment/${commentId}`, {
        username: username,
        comment: editCommentText,
      });
      const updatedComment = response.data;
      console.log('Updated comment:', updatedComment);
      setEditCommentId('');
      setEditCommentText('');
      window.location.reload();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCommentChange = (e) => {
    if (editCommentId) {
      setEditCommentText(e.target.value);
    } else {
      setNewComment(e.target.value);
    }
  };

  return (
    <div id="memory-modal">
      <div id="memory-modal-content" className="row">
        <div className="col-4" id="title-and-img">
          <p className="memory-title">{memory.title}</p>
          <img src={memory.imageUrl} alt={memory.title} />
        </div>
        <div className="col-4" id="info-and-likes">
          <p className="memory-desc">{memory.description}</p>
          <hr className="memory-divider" />
          <p className="memory-owner">Created by {memory.userOwner}</p>
          <p className="memory-date">Created on {new Date(memory.createdAt).toLocaleDateString('en-US')}</p>
          {userId && (
            <>
              <hr className="memory-divider" />
              <button className="like-button" onClick={() => handleToggleLike(memory._id)}>
                {memory.likes.includes(userId) ? 'Unlike' : 'Like'}
              </button>
              <button className="dislike-button" onClick={() => handleToggleDislike(memory._id)}>
                {memory.dislikes.includes(userId) ? 'Undislike' : 'Dislike'}
              </button>
            </>
          )}
          <p className="like-count">Likes: {memory.likes.length}</p>
          <p className="dislike-count">Dislikes: {memory.dislikes.length}</p>
        </div>
        <div className="col-4" id="comments">
          {memory.comments.length > 0 ? (
            <ul>
              {memory.comments.map((comment) => (
                <li key={comment._id}>
                  {editCommentId === comment._id ? (
                    <form onSubmit={(e) => handleCommentUpdate(e, comment._id)}>
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={handleCommentChange}
                        placeholder="Edit comment"
                      />
                      <button type="submit">Update</button>
                      <button onClick={() => setEditCommentId('')}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <p>Username: {comment.username}</p>
                      <p>Comment: {comment.comment}</p>
                      <p>Likes {comment.likes.length}</p>
                      <p>Dislikes: {comment.dislikes.length}</p>
                      {username === comment.username && (
                        <>
                          <button onClick={() => setEditCommentId(comment._id)}>Edit</button>
                          <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                        </>
                      )}
                      {userId && (
                        <>
                          <button onClick={() => handleCommentToggleLike(comment._id)}>
                            {comment.likes.includes(userId) ? 'Unlike' : 'Like'}
                          </button>
                          <button onClick={() => handleCommentToggleDislike(comment._id)}>
                            {comment.dislikes.includes(userId) ? 'Undislike' : 'Dislike'}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments.</p>
          )}
          {userId && (
            <div>
              <input
                type="text"
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Add a comment"
              />
              <button onClick={() => handleCommentSubmit(memory._id)}>Add Comment</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// TODO: Move comment elements into a separate Comment component