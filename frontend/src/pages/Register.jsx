import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/auth/register', {
        username,
        password,
      });
      alert('Registeration Completed! Now Login');
      navigate('/login');
    } catch (error) {
      alert(error.response.data.message);

    }
  };

  return (
    <div className="Body">
      <div className="Box">
        <form onSubmit={handleSubmit}>
          <div className="TextBoxes">
            <label htmlFor="username">Username:</label>
            <input
            className=' mt-3'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <label htmlFor="password" className='mt-2'>Password:</label>
            <input
            className=' mt-3'
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**********"
            />

            <button className="registerButton" type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
