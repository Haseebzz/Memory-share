import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CommentModel } from "../models/Comment.js";
import { UserModel } from "../models/Users.js";
import { MemoryModel } from "../models/Memory.js";
const router = express.Router();


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
  // Like a comment
router.put("/:id/like/:userId", async (req, res) => {
    try {
      const { id, userId } = req.params;
  
      const comment = await CommentModel.findById(id);
  
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
  
      // Check if the user has already liked or disliked the comment
      const userDislikedIndex = comment.dislikes.findIndex(dislike => dislike.userId.toString() === userId);
      const userLikedIndex = comment.likes.findIndex(like => like.userId.toString() === userId);
  
      if (userLikedIndex !== -1) {
        return res.status(400).json({ error: "User has already liked the comment" });
      }
  
      // If the user has previously disliked the comment, remove the dislike
      if (userDislikedIndex !== -1) {
        comment.dislikes.splice(userDislikedIndex, 1);
        comment.dislikesCount -= 1;
      }
  
      // Add the like to the comment
      comment.likes.push({ userId, value: 1 });
      comment.likesCount += 1;
  
      await comment.save();
  
      res.json({ message: "Comment liked successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Dislike a comment
  router.put("/:id/dislike/:userId", async (req, res) => {
    try {
      const { id, userId } = req.params;
  
      const comment = await CommentModel.findById(id);
  
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
  
      // Check if the user has already liked or disliked the comment
      const userLikedIndex = comment.likes.findIndex(like => like.userId.toString() === userId);
      const userDislikedIndex = comment.dislikes.findIndex(dislike => dislike.userId.toString() === userId);
  
      if (userDislikedIndex !== -1) {
        return res.status(400).json({ error: "User has already disliked the comment" });
      }
  
      // If the user has previously liked the comment, remove the like
      if (userLikedIndex !== -1) {
        comment.likes.splice(userLikedIndex, 1);
        comment.likesCount -= 1;
      }
  
      // Add the dislike to the comment
      comment.dislikes.push({ userId, value: 1 });
      comment.dislikesCount += 1;
  
      await comment.save();
  
      res.json({ message: "Comment disliked successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Get total likes of a comment
router.get("/:id/likes", async (req, res) => {
    try {
      const commentId = req.params.id;
  
      const comment = await CommentModel.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
  
      const totalLikes = comment.totalLikes; // Access the virtual field 'totalLikes'
  
      res.json({ totalLikes });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Get total dislikes of a comment
  router.get("/:id/dislikes", async (req, res) => {
    try {
      const commentId = req.params.id;
  
      const comment = await CommentModel.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
  
      const totalDislikes = comment.totalDislikes; // Access the virtual field 'totalDislikes'
  
      res.json({ totalDislikes });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
 
export { router as commentRouter };