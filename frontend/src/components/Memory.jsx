import "../css/Memory.css";
import { useState } from "react";
import axios from 'axios';

export default function Memory({ memory, memoryData }) {
  const username = window.localStorage.username;
  const userId = window.localStorage.userID;

  const handleToggleLike = async (memoryId) => {
    console.log("Function called!");
    try {
      const memory = memoryData.find((memory) => memory._id === memoryId);
      if (memory.likes.includes(userId)) {
        await axios.post(`http://localhost:4000/memory/${memoryId}/unlike/${userId}`);
      } else {
        await axios.post(`http://localhost:4000/memory/${memoryId}/like/${userId}`);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleToggleDislike = async (memoryId) => {
    try {
      const memory = memoryData.find((memory) => memory._id === memoryId);
      if (memory.dislikes.includes(userId)) {
        await axios.post(`http://localhost:4000/memory/${memoryId}/undislike/${userId}`);
      } else {
        await axios.post(`http://localhost:4000/memory/${memoryId}/dislike/${userId}`);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  return (
    <div className="memory-cont">
      <img src={memory.imageUrl} alt={memory.title} />
      <p className="memory-title">{memory.title}</p>
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
      {/* <h1>Comments</h1>
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
      )} */}
    </div>
  );
}