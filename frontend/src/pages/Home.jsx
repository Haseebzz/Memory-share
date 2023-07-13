import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Memory from "../components/Memory";

const Home = () => {
  const [memories, setMemories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedByLikes, setSortedByLikes] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const [comments, setComments] = useState([]);
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
    try {
      const response = await axios.get('http://localhost:4000/comment');
      const fetchedComments = response.data;
      console.log(fetchedComments)
      setComments(fetchedComments);
    } catch (error) {
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

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
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

  const handleCommentChange = (e) => {
    if (editCommentId) {
      setEditCommentText(e.target.value);
    } else {
      setNewComment(e.target.value);
    }
  };

  return (
    <div className="container">
      <h2>Memories</h2>
      <div>
        <input type="text" value={searchQuery} onChange={handleInputChange} placeholder="Search by title" />
        <button onClick={handleSearch}>Search</button>
        <button onClick={sortMemoriesByLikes}>Sort by likes</button>
        <button onClick={() => window.location.reload()}>Sort by original</button>
      </div>
      {memories.map((m) => (
        <Memory
          key={m._id}
          memory={m}
          memoryData={memories}
        />
      ))}
    </div>
  );
};

export default Home;