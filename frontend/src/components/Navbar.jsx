import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Navbar = () => {
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["access_token"]);

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/")
    window.location.reload();
   
}

  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      {!cookies.access_token && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
      {cookies.access_token && (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/create">Create</Link>
          <Link to="/usermemory">MyMemory</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
