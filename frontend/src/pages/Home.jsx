import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [memories, setMemories] = useState([]);
  const[comments,setComments] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const [sortedByLikes, setSortedByLikes] = useState(false);
  const userId = window.localStorage.userID;
  const username = window.localStorage.username;
  
  const fetchMemories = async () => {
    try {
      let url = 'http://localhost:4000/memory';
  
      if (sortedByLikes) {
        url = 'http://localhost:4000/memory/score';
      }
     
      const response = await axios.get(url);
      const fetchedMemories = response.data;
      setMemories(fetchedMemories);
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };
 const fetchComments = async () => {
  try{
    const response = await axios.get('http://localhost:4000/comment');
    const fetchedComments = response.data;
    console.log(fetchedComments)
    setComments(fetchedComments);
  } catch(error) {
    console.error('Error', error)
  }
 }
 const sortMemoriesByLikes = async () => {
  try {
    const response = await axios.get('http://localhost:4000/memory/score');
    const sortedMemories = response.data.sort((a, b) => b.likes.length - a.likes.length);
    setMemories(sortedMemories);
    setSortedByLikes(true);
  } catch (error) {
    console.error('Error sorting memories by likes:', error);
  }
};

  useEffect(() => {
    fetchMemories();
    fetchComments();

  }, [sortedByLikes]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/memory/search?q=${searchQuery}`);
      const searchedMemories = response.data;
      setMemories(searchedMemories);
    } catch (error) {
      console.error('Error searching memories:', error);
    }
  };

  const handleToggleLike = async (memoryId) => {
    try {
      const memory = memories.find((memory) => memory._id === memoryId);
      if (memory.likes.includes(userId)) {
        await axios.post(`http://localhost:4000/memory/${memoryId}/unlike/${userId}`);
      } else {
        await axios.post(`http://localhost:4000/memory/${memoryId}/like/${userId}`);
      }
      fetchMemories();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleToggleDislike = async (memoryId) => {
    try {
      const memory = memories.find((memory) => memory._id === memoryId);
      if (memory.dislikes.includes(userId)) {
        await axios.post(`http://localhost:4000/memory/${memoryId}/undislike/${userId}`);
      } else {
        await axios.post(`http://localhost:4000/memory/${memoryId}/dislike/${userId}`);
      }
      fetchMemories();
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };
 
  const handleCommentToggleLike = async (commentId) => {
    try {
      const comment = comments.find((c) => c._id === commentId);
      if (comment.likes.includes(userId)) {
        await axios.post(`http://localhost:4000/comment/${commentId}/unlike/${userId}`);
      } else {
        await axios.post(`http://localhost:4000/comment/${commentId}/like/${userId}`);
      }
      fetchMemories()
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
      fetchMemories();
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
      window.location.reload()
      fetchMemories();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:4000/comment/${commentId}`);
      fetchMemories();
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
      fetchMemories();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCommentChange = (e) => {
    if (editCommentId) {
      setEditCommentText(e.target.value);
    } else {
      setNewComment(e.target.value);
    }
  };

  return (
    <div>
      <h2>Memories</h2>
      <div>
        <input type="text" value={searchQuery} onChange={handleInputChange} placeholder="Search by title" />
        <button onClick={handleSearch}>Search</button>
        <button onClick={sortMemoriesByLikes}>Sort by likes</button>
        <button onClick={()=>window.location.reload()}>Sort by original</button>
      </div>
      {memories.map((memory) => (
        <div key={memory._id}>
          <p>{memory._id}</p>
          <h3>{memory.title}</h3>
          <img src={memory.imageUrl} alt={memory.title} />
          <p>Owner: {memory.userOwner}</p>
          <p>Description: {memory.description}</p>
          <p>Created: {new Date(memory.createdAt).toLocaleDateString('en-US')}</p>
          {userId && (
            <>
              <button onClick={() => handleToggleLike(memory._id)}>
                {memory.likes.includes(userId) ? 'Unlike' : 'Like'}
              </button>
              <button onClick={() => handleToggleDislike(memory._id)}>
                {memory.dislikes.includes(userId) ? 'Undislike' : 'Dislike'}
              </button>
            </>
          )}
          <p>Total Likes: {memory.likes.length}</p>
          <p>Total Dislikes: {memory.dislikes.length}</p>
          <h1>Comments</h1>
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
      ))}
      
    </div>
  );
};

export default Home;