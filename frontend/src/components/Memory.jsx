import "../css/Memory.css";
import { useState } from "react";
import axios from 'axios';
import Modal from "./Modal";

export default function Memory({ memory, memoryData, commentData }) {
  const userId = window.localStorage.userID;
  const [showModal, setShowModal] = useState(false);

  const handleToggleLike = async (memoryId) => {
    console.log("Function called!");
    try {
      const memory = memoryData.find((memory) => memory._id === memoryId);
      if (memory.likes.includes(userId)) {
        await axios.post(`http://localhost:4000/memory/${memoryId}/unlike/${userId}`);
      } else {
        await axios.post(`http://localhost:4000/memory/${memoryId}/like/${userId}`);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleToggleDislike = async (memoryId) => {
    try {
      const memory = memoryData.find((memory) => memory._id === memoryId);
      if (memory.dislikes.includes(userId)) {
        await axios.post(`http://localhost:4000/memory/${memoryId}/undislike/${userId}`);
      } else {
        await axios.post(`http://localhost:4000/memory/${memoryId}/dislike/${userId}`);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const openModal = () => {
    document.querySelector("body").style.overflow = "hidden";
    setShowModal(true)
  };

  return (
    <>
      {showModal && (
        <Modal
          memory={memory}
          comments={commentData}
          setShowModal={setShowModal}
          userId={userId}
          handleToggleLike={handleToggleLike}
          handleToggleDislike={handleToggleDislike}
        />
      )}
      <div className="memory-cont p-2">
        <img src={memory.imageUrl} alt={memory.title} className="rounded-lg shadow-md  mt-2" />
        <p className="memory-title text-3xl text-blue-600 mt-3 max-w-full whitespace-pre-line overflow-hidden">Title: {memory.title}</p>
        <p className="memory-desc text-3xl text-blue-600 mt-3 max-w-full whitespace-normal overflow-hidden">Description: {memory.description}</p>
        <hr className="memory-divider text-3xl text-blue-600 w-50 h-2 bg-white mt-3" />
        <p className="memory-owner text-3xl text-blue-600 mt-3 max-w-full whitespace-pre-line overflow-hidden">Created by {memory.userOwner}</p>
        <p className="memory-date text-3xl text-blue-600 mt-3 max-w-full whitespace-pre-line overflow-hidden">Created on {new Date(memory.createdAt).toLocaleDateString('en-US')}</p>
        {userId && (
          <>
            <hr className="memory-divider" />
            <button className="like-button mr-5 text-4xl" onClick={() => handleToggleLike(memory._id)}>
              {memory.likes.includes(userId) ? 'Unlike' : 'Like'}
            </button>
            <button className="dislike-button mr-5 text-4xl" onClick={() => handleToggleDislike(memory._id)}>
              {memory.dislikes.includes(userId) ? 'Undislike' : 'Dislike'}
            </button>
          </>
        )}
        <p className="like-count text-3xl text-green-600 mt-3 ">Likes: {memory.likes.length}</p>
        <p className="dislike-count text-3xl text-red-600 mt-3">Dislikes: {memory.dislikes.length}</p>
        <button className="text-3xl text-blue-600 mt-3" onClick={openModal}>View More</button>
      </div>
    </>
  );
}

