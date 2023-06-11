import express from "express";
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { userRouter } from "./routes/user.js";
import { commentRouter } from "./routes/comment.js";
import { memoryRouter } from "./routes/memory.js";

const app = express()
app.use(express.json());
dotenv.config();
app.use(cors());

app.use("/auth",userRouter);
app.use("/comment",commentRouter);
app.use("/memory", memoryRouter);

mongoose.connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

app.get("/", (req,res)=> {
    res.send("Hello World")
})


app.listen(4000, () => {
    console.log("everything is running")
} )