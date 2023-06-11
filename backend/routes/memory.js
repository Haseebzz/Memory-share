import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { MemoryModel } from "../models/Memory.js";
import { UserModel } from "../models/Users.js";
const router = express.Router();


//getting all the memories
router.get('/', async (req, res) => {
    try {
      const memories = await MemoryModel.find();
      res.json(memories);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Create a new memory route



// Create a new memory route
router.post('/', async (req, res) => {
  try {
    
    const { title, imageUrl, userOwner, description } = req.body;

    
    const newMemory = new MemoryModel({
      title,
      imageUrl,
      userOwner,
      description,
    });

    
    const savedMemory = await newMemory.save();

    
    const user = await UserModel.findOne({ username: userOwner });

    user.memories = user.memories.concat(savedMemory);
    await user.save();

    res.status(201).json(savedMemory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Delete a memory by ID route
router.delete('/:id', async (req, res) => {
    try {
      const memoryId = req.params.id;
  
     
      const deletedMemory = await MemoryModel.findByIdAndDelete(memoryId);
  
      if (!deletedMemory) {
        return res.status(404).json({ error: 'Memory not found' });
      }
  
     
      const user = await UserModel.findOne({ username: deletedMemory.userOwner });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
    
      user.memories = user.memories.filter(
        (memory) => memory._id.toString() !== memoryId
      );
      await user.save();
  
      res.json({ message: 'Memory deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  //updating a memory
  
router.put('/:id', async (req, res) => {
    try {
      const memoryId = req.params.id;
      const { title, imageUrl, description } = req.body;
  
     
      const memory = await MemoryModel.findById(memoryId);
  
      if (!memory) {
        return res.status(404).json({ error: 'Memory not found' });
      }
  
     
      memory.title = title || memory.title;
      memory.imageUrl = imageUrl || memory.imageUrl;
      memory.description = description || memory.description;
  
    
      const updatedMemory = await memory.save();
  
      res.json(updatedMemory);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Search memories by title route
router.get('/search', async (req, res) => {
    try {
      const searchQuery = req.query.q;
  
     
      const memories = await MemoryModel.find({
        title: { $regex: searchQuery, $options: 'i' }
      });
  
      res.json(memories);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });


// Like a memory
router.put('/:id/like/:userId', async (req, res) => {
    try {
      const { id, userId } = req.params;
  
      const memory = await MemoryModel.findById(id);
  
      if (!memory) {
        return res.status(404).json({ error: 'Memory not found' });
      }
  
      // Check if the user has already liked or disliked the memory
      const userLikedIndex = memory.likes.findIndex(like => like.userId.toString() === userId);
      const userDislikedIndex = memory.dislikes.findIndex(dislike => dislike.userId.toString() === userId);
  
      if (userLikedIndex !== -1) {
        return res.status(400).json({ error: 'User has already liked the memory' });
      }
  
      // If the user has previously disliked the memory, remove the dislike
      if (userDislikedIndex !== -1) {
        memory.dislikes.splice(userDislikedIndex, 1);
        memory.dislikesCount -= 1;
      }
  
      // Add the like to the memory
      memory.likes.push({ userId, value: 1 });
      memory.likesCount += 1;
  
      await memory.save();
  
      res.json({ message: 'Memory liked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Dislike a memory
  router.put('/:id/dislike/:userId', async (req, res) => {
    try {
      const { id, userId } = req.params;
  
      const memory = await MemoryModel.findById(id);
  
      if (!memory) {
        return res.status(404).json({ error: 'Memory not found' });
      }
  
      // Check if the user has already liked or disliked the memory
      const userDislikedIndex = memory.dislikes.findIndex(dislike => dislike.userId.toString() === userId);
      const userLikedIndex = memory.likes.findIndex(like => like.userId.toString() === userId);
  
      if (userDislikedIndex !== -1) {
        return res.status(400).json({ error: 'User has already disliked the memory' });
      }
  
      // If the user has previously liked the memory, remove the like
      if (userLikedIndex !== -1) {
        memory.likes.splice(userLikedIndex, 1);
        memory.likesCount -= 1;
      }
  
      // Add the dislike to the memory
      memory.dislikes.push({ userId, value: 1 });
      memory.dislikesCount += 1;
  
      await memory.save();
  
      res.json({ message: 'Memory disliked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Get total likes of a memory
router.get('/:id/likes', async (req, res) => {
    try {
      const memoryId = req.params.id;
  
      const memory = await MemoryModel.findById(memoryId);
  
      if (!memory) {
        return res.status(404).json({ error: 'Memory not found' });
      }
  
      const totalLikes = memory.totalLikes;
  
      res.json({ totalLikes });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Get total dislikes of a memory
  router.get('/:id/dislikes', async (req, res) => {
    try {
      const memoryId = req.params.id;
  
      const memory = await MemoryModel.findById(memoryId);
  
      if (!memory) {
        return res.status(404).json({ error: 'Memory not found' });
      }
  
      const totalDislikes = memory.totalDislikes;
  
      res.json({ totalDislikes });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  

export { router as memoryRouter };