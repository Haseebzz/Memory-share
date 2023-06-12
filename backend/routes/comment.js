import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CommentModel } from "../models/Comment.js";
import { UserModel } from "../models/Users.js";
import { MemoryModel } from "../models/Memory.js";
const router = express.Router();

// Fetch all comments
router.get("/", async (req, res) => {
  try {
    const comments = await CommentModel.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new comment
router.post("/:memoryId", async (req, res) => {
    try {
      const { username, comment } = req.body;
      const memoryId = req.params.memoryId;
  
      const newComment = new CommentModel({
        username,
        comment,
      });
  
      const savedComment = await newComment.save();
  
      // Find the associated memory and concatenate the comment to its comments array
      const memory = await MemoryModel.findById(memoryId);
  
      if (!memory) {
        return res.status(404).json({ error: "Memory not found" });
      }
  
      memory.comments = memory.comments.concat(savedComment);
      await memory.save();
  
      res.status(201).json(savedComment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
// Delete a comment by ID
router.delete("/:commentId", async (req, res) => {
    try {
      const commentId = req.params.commentId;
  
      // Find the comment by ID and delete it
      const deletedComment = await CommentModel.findByIdAndDelete(commentId);
  
      if (!deletedComment) {
        return res.status(404).json({ error: "Comment not found" });
      }
  
      // Remove the comment ID from memory.comments array
      await MemoryModel.updateOne(
        { "comments._id": commentId },
        { $pull: { comments: { _id: commentId } } }
      );
  
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Update a comment by ID
router.put("/:commentId", async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const { username, comment } = req.body;
  
      // Find the comment by ID
      const commentToUpdate = await CommentModel.findById(commentId);
  
      if (!commentToUpdate) {
        return res.status(404).json({ error: "Comment not found" });
      }
  
      // Check if the username matches the owner of the comment
      if (commentToUpdate.username !== username) {
        return res.status(403).json({ error: "You are not authorized to edit this comment" });
      }
  
      // Update the comment
      commentToUpdate.comment = comment;
      const updatedComment = await commentToUpdate.save();
  
      // Find the memory containing the comment
      const memory = await MemoryModel.findOne({ "comments._id": commentId });
  
      if (!memory) {
        return res.status(404).json({ error: "Memory not found" });
      }
  
      // Update the comment in the memory's comments array
      const updatedMemory = await MemoryModel.findOneAndUpdate(
        { "comments._id": commentId },
        { $set: { "comments.$.comment": comment } },
        { new: true }
      );
  
      res.json(updatedComment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });


 router.post('/:id/like/:userId', async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.params.userId;

    const memory = await MemoryModel.findOne({ 'comments._id': commentId });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const comment = memory.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const hasLiked = comment.likes.includes(userId);
    const hasDisliked = comment.dislikes.includes(userId);

    if (!hasLiked) {
      comment.likes.push(userId);
      comment.likeCount++;

      if (hasDisliked) {
        comment.dislikes.pull(userId);
        comment.dislikeCount--;
      }
    } else {
      comment.likes.pull(userId);
      comment.likeCount--;
    }

    await memory.save();
    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/dislike/:userId', async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.params.userId;

    const memory = await MemoryModel.findOne({ 'comments._id': commentId });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const comment = memory.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const hasDisliked = comment.dislikes.includes(userId);
    const hasLiked = comment.likes.includes(userId);

    if (!hasDisliked) {
      comment.dislikes.push(userId);
      comment.dislikeCount++;

      if (hasLiked) {
        comment.likes.pull(userId);
        comment.likeCount--;
      }
    } else {
      comment.dislikes.pull(userId);
      comment.dislikeCount--;
    }

    await memory.save();
    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/unlike/:userId', async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.params.userId;

    const memory = await MemoryModel.findOne({ 'comments._id': commentId });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const comment = memory.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes.pull(userId);
      comment.likeCount--;
    }

    await memory.save();
    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/undislike/:userId', async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.params.userId;

    const memory = await MemoryModel.findOne({ 'comments._id': commentId });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const comment = memory.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const hasDisliked = comment.dislikes.includes(userId);

    if (hasDisliked) {
      comment.dislikes.pull(userId);
      comment.dislikeCount--;
    }

    await memory.save();
    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

  



export { router as commentRouter };