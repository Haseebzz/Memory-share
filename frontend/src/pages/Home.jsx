import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Memory from "../components/Memory";
import newimage from "../newimage.jpg"

const Home = () => {
  const [memories, setMemories] = useState([]);
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedByLikes, setSortedByLikes] = useState(false);

  const fetchMemories = async () => {
    try {
      let url = 'http://localhost:4000/memory';

      if (sortedByLikes) {
        url = 'http://localhost:4000/memory/score';
      }

      const response = await axios.get(url);
      const fetchedMemories = response.data;
      setMemories(fetchedMemories);
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };
  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:4000/comment');
      const fetchedComments = response.data;
      console.log(fetchedComments)
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error', error)
    }
  }
  const sortMemoriesByLikes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/memory/score');
      const sortedMemories = response.data.sort((a, b) => b.likes.length - a.likes.length);
      setMemories(sortedMemories);
      setSortedByLikes(true);
    } catch (error) {
      console.error('Error sorting memories by likes:', error);
    }
  };

  useEffect(() => {
    fetchMemories();
    fetchComments();

  }, [sortedByLikes]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/memory/search?q=${searchQuery}`);
      const searchedMemories = response.data;
      setMemories(searchedMemories);
    } catch (error) {
      console.error('Error searching memories:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`bg-cover bg-center bg-no-repeat min-h-screen relative`} style={{ backgroundImage: `url(${newimage})` }}>
      <h2 className=''>Memories</h2>
      <div className=' flex flex-col md:flex-row justify-center items-center m-5'>
        <input type="text" className=' text-3xl rounded mr-2 ' value={searchQuery} onChange={handleInputChange} placeholder="Search by title" />
        <button className=' text-4xl mr-2 text-blue-500' onClick={handleSearch}>Search</button>
        <button className='text-4xl mr-2 text-red-500 mr-2' onClick={sortMemoriesByLikes}>Sort by likes</button>
        <button className='text-4xl mr-2 text-orange-500' onClick={() => window.location.reload()}>Sort by original</button>
      </div>
      {memories.map((m) => (
        <Memory
          key={m._id}
          memory={m}
          memoryData={memories}
          commentData={comments}
        />
      ))}
    </div>
  );
};

export default Home;