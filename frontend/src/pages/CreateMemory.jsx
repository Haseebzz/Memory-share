import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateMemory = () => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const userOwner = window.localStorage.username
  const [description, setDescription] = useState('');
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newMemory = {
      title,
      imageUrl,
      userOwner,
      description,
    };

    try {
      await axios.post('http://localhost:4000/memory', newMemory);
      // Handle successful creation
      alert('Memory created successfully!');
      navigate("/")
      console.log('Memory created successfully!');
    } catch (error) {
      // Handle error
      console.error('Error creating memory:', error);
      alert('Error creating memory. Please try again.');
    }

    // Clear form fields
    setTitle('');
    setImageUrl('');

    setDescription('');
  };

  return (
    <div>
      <h2>Create Memory</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Image URL:</label>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateMemory;
