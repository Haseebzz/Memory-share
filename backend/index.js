import express from "express";
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

const app = express()
app.use(express.json());
dotenv.config();
app.use(cors());


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