import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import '../css/Profile.css';
import newimage from "../newimage.jpg"
const Profile = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userId = window.localStorage.userID;
  const user = window.localStorage.username
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const result = await axios.put(`http://localhost:4000/auth/update/${userId}`, {
          username,
          password
      })
      window.location.reload();
      window.localStorage.setItem("username", username);

  } catch (error) {
    alert("username can't contain numbers or symbols");
  }
  };

  return (
    <div className={`bg-cover bg-center bg-no-repeat min-h-screen relative`} style={{ backgroundImage: `url(${newimage})` }}>
    <h1>Profile</h1>
    <h2>Welcome {user}!</h2>
    <h3>Update Information</h3>
    <form onSubmit={handleSubmit} className='mt-5 flex flex-col justify-center items-center gap-3'>
      <label htmlFor="username" className='text-4xl text-green-500'>Username:</label>
      <input
      className='mt-4 rounded-xl text-3xl  p-3 flex   text-black '
        id="username"
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="password" className='text-4xl text-green-500'>Password:</label>
      <input
      className='mt-4 text-3xl rounded-xl  p-3 flex   text-black'
        id="password"
        type="password"
        placeholder="**********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto text-black py-3"type="submit">Update Information</button>
    </form>
  </div>
  )
};

export default Profile;
