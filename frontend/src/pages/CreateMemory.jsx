import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../css/CreateMemory.css";

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
    <div className="container">
    <div className="body">
      <div className="title">
      <h2>Create Memory</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="titleBox">
          <label className="ttle">Title:</label>
          <input className="ttle1" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="imgUrlBox">
          <label className="url">Image URL:</label>
          <input className="url1" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        
        <div className="desBox">
          <label className='des'>Description:</label>
          <textarea className='des1' value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        
        <button type="submit">Create</button>
      </form>
    </div>
    </div>
  );
};

export default CreateMemory;
