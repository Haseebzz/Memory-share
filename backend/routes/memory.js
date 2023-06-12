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

 // getting all the memories sorted by score
 router.get('/score', async (req, res) => {
  try {
    const memories = await MemoryModel.find().sort({ likeCount: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



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



  
 // Get memories by user ID route
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const memories = await MemoryModel.find({ userOwner: user.username });

    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Like a memory route
router.post('/:id/like/:userId', async (req, res) => {
  try {
    const memoryId = req.params.id;
    const userId = req.params.userId;

    const memory = await MemoryModel.findById(memoryId);

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const hasLiked = memory.likes.includes(userId);

    if (!hasLiked) {
      memory.likes.push(userId);
      memory.likeCount++;
      
      if (memory.dislikes.includes(userId)) {
        memory.dislikes.pull(userId);
        memory.dislikeCount--;
      }

      const updatedMemory = await memory.save();
      res.json(updatedMemory);
    } else {
      res.json(memory); // Memory already liked by the user, no changes needed
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Dislike a memory route
router.post('/:id/dislike/:userId', async (req, res) => {
  try {
    const memoryId = req.params.id;
    const userId = req.params.userId;

    const memory = await MemoryModel.findById(memoryId);

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const hasDisliked = memory.dislikes.includes(userId);

    if (!hasDisliked) {
      memory.dislikes.push(userId);
      memory.dislikeCount++;
      
      if (memory.likes.includes(userId)) {
        memory.likes.pull(userId);
        memory.likeCount--;
      }

      const updatedMemory = await memory.save();
      res.json(updatedMemory);
    } else {
      res.json(memory); // Memory already disliked by the user, no changes needed
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Unlike a memory route
router.post('/:id/unlike/:userId', async (req, res) => {
  try {
    const memoryId = req.params.id;
    const userId = req.params.userId;

    const memory = await MemoryModel.findById(memoryId);

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    if (memory.likes.includes(userId)) {
      memory.likes.pull(userId);
      memory.likeCount--;

      const updatedMemory = await memory.save();
      res.json(updatedMemory);
    } else {
      res.json(memory); // Memory not liked by the user, no changes needed
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Undislike a memory route
router.post('/:id/undislike/:userId', async (req, res) => {
  try {
    const memoryId = req.params.id;
    const userId = req.params.userId;

    const memory = await MemoryModel.findById(memoryId);

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    if (memory.dislikes.includes(userId)) {
      memory.dislikes.pull(userId);
      memory.dislikeCount--;

      const updatedMemory = await memory.save();
      res.json(updatedMemory);
    } else {
      res.json(memory); // Memory not disliked by the user, no changes needed
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


export { router as memoryRouter };