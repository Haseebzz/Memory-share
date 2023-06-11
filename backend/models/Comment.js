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
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      value: {
        type: Number,
        default: 0,
      },
    },
  ],
  dislikes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      value: {
        type: Number,
        default: 0,
      },
    },
  ],
});

commentSchema.virtual('totalLikes').get(function () {
  return this.likes.reduce((total, like) => total + like.value, 0);
});

commentSchema.virtual('totalDislikes').get(function () {
  return this.dislikes.reduce((total, dislike) => total + dislike.value, 0);
});



export const CommentModel = mongoose.model("Comment", commentSchema);