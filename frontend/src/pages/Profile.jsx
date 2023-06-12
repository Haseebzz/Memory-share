import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

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
    <>
    
        <h2>Profile</h2>
        <h1>welcome {user}</h1>
        <h1>Update Information</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username" >
              Username:
            </label>
            <input
              id="username"
              type="text"
             
              placeholder="Enter your username" 
              value={username}
        onChange={(e) => setUsername(e.target.value)}
              />
              
       

       
            <label htmlFor="password" >
              Password:
            </label>
            <input
              id="password"
              type="password"
             
              placeholder="**********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
       

          <button 
          type='submit'> 
            Update Information
          </button>
        </form>
      
    </>
  )
};

export default Profile;
