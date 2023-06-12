import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
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
});




export const CommentModel = mongoose.model("Comment", commentSchema);