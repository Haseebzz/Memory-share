

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import CreateMemory from './pages/CreateMemory';
import Login from './pages/Login';
import UserMemory from './pages/UserMemory';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './css/App.css';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/create" element={<CreateMemory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/usermemory" element={<UserMemory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
