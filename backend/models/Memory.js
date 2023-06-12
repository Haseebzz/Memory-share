import mongoose from "mongoose";
import { CommentModel } from "./Comment.js";

const memorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userOwner: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  }],
  likeCount: {
    type: Number,
    default: 0,
    min: 0
  },
  dislikeCount: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [CommentModel.schema]
});

export const MemoryModel = mongoose.model("Memories", memorySchema);
