import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/booksRoutes.js";

import { connectdb } from "./lib/db.js";


const app = express();
const port = process.env.PORT;


app.use(express.json())
app.use(cors());

//routes
app.use("/api/auth",authRoutes);
app.use("/api/books",bookRoutes);

app.listen(port,()=>{
    console.log(`server running at port ${port}`);
    connectdb();
    console.log(process.env.MONGO_URI);
})

