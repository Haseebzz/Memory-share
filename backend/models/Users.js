import mongoose from "mongoose";
import { MemoryModel } from "./Memory.js";


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 12
    },
    password: {
        type: String,
        required: true,
    },
    memories: [MemoryModel.schema]
})

export const UserModel = mongoose.model("users", userSchema)