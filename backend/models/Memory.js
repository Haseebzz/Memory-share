import mongoose from "mongoose";
import { CommentModel } from "./Comment.js";


const memorySchema = mongoose.Schema( {
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
    createdAt: {
        type: Date,
        default: Date.now,
      },
    comments: [CommentModel.schema]
})
memorySchema.virtual('totalLikes').get(function () {
    return this.likes.reduce((total, like) => total + like.value, 0);
  });
  
  memorySchema.virtual('totalDislikes').get(function () {
    return this.dislikes.reduce((total, dislike) => total + dislike.value, 0);
  });

export const MemoryModel = mongoose.model("Memories", memorySchema)