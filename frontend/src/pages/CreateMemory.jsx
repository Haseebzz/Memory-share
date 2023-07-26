import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../css/CreateMemory.css";
import newimage from "../newimage.jpg"
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
    <div className={`bg-cover bg-center bg-no-repeat min-h-screen relative p-5`} style={{ backgroundImage: `url(${newimage})` }}>
   
      <div className="title ">
        <h2 className=''>Create Memory</h2>
      </div>
      <form onSubmit={handleSubmit} className='mt-5 flex flex-col justify-center items-center gap-3'>
        <div className="flex flex-col">
          <label className="text-3xl mr-3">Title:</label>
          <input className=" mt-4 text-3xl rounded-xl  p-3 flex w-full  text-black" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="imgUrlBox flex flex-col">
          <label className="text-3xl mr-3">Image URL:</label>
          <input className=" mt-4 text-3xl rounded-xl  p-3 flex w-full  text-black" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        
        <div className="desBox flex flex-col">
          <label className='text-3xl mr-3'>Description:</label>
          <textarea className='mt-4 text-3xl rounded-xl  p-3 flex w-full  text-black' value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        
        <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto text-black py-3' type="submit">Create</button>
      </form>
    </div>
 
  );
};

export default CreateMemory;
