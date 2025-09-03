import "dotenv/config";
import express from "express";

import cors from "cors";

import job from "./lib/cron.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/booksRoutes.js";

import { connectdb } from "./lib/db.js";

const app = express();
const port = process.env.PORT;

job.start();

app.use(cors());
app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // for form data

app.use((req, res, next) => {
  console.log("Incoming request:", JSON.stringify(req.url));
  next();
});

//routes
app.use("/api/auth",authRoutes);
app.use("/api/books",bookRoutes);




app.listen(port,()=>{
    console.log(`server running at port ${port}`);
    connectdb();
    console.log(process.env.MONGO_URI);
})

