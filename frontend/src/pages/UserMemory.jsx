import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserMemory = () => {
  const [userMemories, setUserMemories] = useState([]);
  const userId = window.localStorage.userID;
  const [editedMemory, setEditedMemory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUserMemories();
  }, []);

  const fetchUserMemories = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/memory/user/${userId}`);
      setUserMemories(response.data);
    } catch (error) {
      console.error('Error fetching user memories:', error);
    }
  };

  const handleDeleteMemory = async (memoryId) => {
    try {
      await axios.delete(`http://localhost:4000/memory/${memoryId}`);
      fetchUserMemories();
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const handleEditMemory = (memory) => {
    setEditedMemory(memory);
  };

  const handleUpdateMemory = async () => {
    try {
      const { _id, title, imageUrl, description } = editedMemory;
      await axios.put(`http://localhost:4000/memory/${_id}`, { title, imageUrl, description });
      setEditedMemory(null);
      fetchUserMemories();
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedMemory(null);
  };

  const handleInputChange = (e) => {
    setEditedMemory({
      ...editedMemory,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/memory/search?q=${searchQuery}`);
      setUserMemories(response.data);
    } catch (error) {
      console.error('Error searching memories:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <h2>User Memories</h2>
      <div>
        <input type="text" value={searchQuery} onChange={handleSearchInputChange} placeholder="Search by title" />
        <button onClick={handleSearch}>Search</button>
      </div>
      {userMemories.map((memory) => (
        <div key={memory._id}>
          {editedMemory && editedMemory._id === memory._id ? (
            <>
              <input
                type="text"
                name="title"
                value={editedMemory.title}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="imageUrl"
                value={editedMemory.imageUrl}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="description"
                value={editedMemory.description}
                onChange={handleInputChange}
              />
              <button onClick={handleUpdateMemory}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{memory.title}</h3>
              <img src={memory.imageUrl} alt={memory.title} />
              <p>{memory.description}</p>
              <p>Total Likes: {memory.likes.length}</p>
          <p>Total Dislikes: {memory.dislikes.length}</p>
          <ul>
            {memory.comments.map((comment) => (
              <li key={comment._id}>
                <p>Username: {comment.username}</p>
                <p>Comment: {comment.comment}</p>
                <p>Likes: {comment.likes.length}</p>
                <p>Dislikes: {comment.dislikes.length}</p>
              </li>
            ))}
          </ul>
              <button onClick={() => handleDeleteMemory(memory._id)}>Delete Memory</button>
              <button onClick={() => handleEditMemory(memory)}>Edit Memory</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserMemory;
