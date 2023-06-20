import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import "../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["access_token"]);

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/")
    window.location.reload();

  }

  useEffect(() => {
    const navRight = document.getElementById("right-section");

    if (!cookies.access_token) {
      navRight.style.gridTemplateColumns = "1fr 1fr 1fr";
      navRight.style.gridTemplateAreas = '"about register login"';
    } else {
      navRight.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
      navRight.style.gridTemplateAreas = '"about profile create memories logout"';
    }

  });

  return (
    <div className="navbar">
      <div id="left-section">
        <Link to="/" id="home" className="goh">Memory Share</Link>
      </div>
      <div id='right-section'>
        <Link to="/about" id="about" className="goh">About</Link>
        {!cookies.access_token && (
          <>
            <Link to="/register" id="register" className="goh">Register</Link>
            <Link to="/login" id="login" className="goh">Login</Link>
          </>
        )}
        {cookies.access_token && (
          <>
            <Link to="/profile" id="profile" className="goh">Profile</Link>
            <Link to="/create" id="create" className="goh">Create</Link>
            <Link to="/usermemory" id="memories" className="goh">MyMemory</Link>
            <button onClick={logout} id="logout" className="goh">Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
