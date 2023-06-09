import React, {useState} from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
          await axios.post('http://localhost:4000/auth/register', {
              username,
              password,
          })
          alert("Registeration Completed! Now Login");
          navigate("/login")
        } catch (error) {
          console.log(error);
        }
      };


  return (
    <div>
     <form  onSubmit={handleSubmit}>
      <label htmlFor="username">
        Username:
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />
      <label htmlFor="password">
        Password:
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="**********"
      />
   
   
      <button
        type="submit"
      >
        Register
      </button>
  </form>
    </div>
  )
}

export default Register