import React from 'react';
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

  return (
    <div className="navbar">
      <div className="row">
        <div className="col-6" id="left">
          <Link to="/" id="home" className="link">Memory Share</Link>
        </div>
        <div className="col-6" id="right">
          <div className="row">
            <Link to="/about" id="about" className="link col">About</Link>
            {!cookies.access_token && (
              <>
                <Link to="/register" id="register" className="link col">Register</Link>
                <Link to="/login" id="login" className="link col">Login</Link>
              </>
            )}
            {cookies.access_token && (
              <>
                <Link to="/profile" id="profile" className="link col">Profile</Link>
                <Link to="/create" id="create" className="link col">Create</Link>
                <Link to="/usermemory" id="memories" className="link col">My Memories</Link>
                <button onClick={logout} id="logout" className="link col">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
