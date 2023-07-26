import React, { useEffect, useState } from 'react';
import axios from 'axios';
import newimage from "../newimage.jpg"
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
      const response = await axios.get(`http://localhost:4000/memory/search/${userId}?q=${searchQuery}`);
      setUserMemories(response.data);
    } catch (error) {
      console.error('Error searching memories:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`bg-cover bg-center bg-no-repeat min-h-screen relative`} style={{ backgroundImage: `url(${newimage})` }}>
  <h2>User Memories</h2>
  <div className='flex flex-col items-center'>
    <input className=' mt-4 text-2xl rounded-xl p-3 flex text-black' type="text" value={searchQuery} onChange={handleSearchInputChange} placeholder="Search by title" />
    <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto text-black py-3' onClick={handleSearch}>Search</button>
  </div>
  {userMemories.map((memory) => (
    <div className='flex flex-col items-center' key={memory._id}>
      {editedMemory && editedMemory._id === memory._id ? (
        <>
        <input
            className="mt-2 p-2 rounded-lg border border-gray-400 w-64"
            type="text"
            name="title"
            value={editedMemory.title}
            onChange={handleInputChange}
            placeholder="Enter title"
          />
          <input
            className="mt-2 p-2 rounded-lg border border-gray-400 w-64"
            type="text"
            name="imageUrl"
            value={editedMemory.imageUrl}
            onChange={handleInputChange}
            placeholder="Enter image URL"
          />
          <input
            className="mt-2 p-2 rounded-lg border border-gray-400 w-64"
            type="text"
            name="description"
            value={editedMemory.description}
            onChange={handleInputChange}
            placeholder="Enter description"
          />
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-3" onClick={handleUpdateMemory}>Save</button>
          <button className="bg-red-500 text-white py-2 px-4 rounded-md mt-2" onClick={handleCancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h3>Title: {memory.title}</h3>
          <img className='mt-3' src={memory.imageUrl} alt={memory.title} />
          <p className='text-3xl text-blue-600 mt-3 max-w-full whitespace-pre-line overflow-hidden'>Description: {memory.description}</p>
          <p className='text-3xl text-green-600 mt-3 max-w-full whitespace-pre-line overflow-hidden'>Total Likes: {memory.likes.length}</p>
          <p className='text-3xl text-red-600 mt-3 max-w-full whitespace-pre-line overflow-hidden'>Total Dislikes: {memory.dislikes.length}</p>
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
          <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto text-black py-3' onClick={() => handleDeleteMemory(memory._id)}>Delete Memory</button>
          <button className='bg-[#3400df] w-[200px] rounded-md font-medium my-6 mx-auto text-black py-3' onClick={() => handleEditMemory(memory)}>Edit Memory</button>
        </>
      )}
    </div>
  ))}
</div>

  );
};

export default UserMemory;
