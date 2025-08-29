import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/book.js";
import authprotected from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/",authprotected, async (req,res)=>{
    try{
        const {title , caption , rating , image} = req.body;
        if(!image || !title || !caption || !rating) return res.status(400).json({message:"Fill all the details"});

        //upload the image to cloudinary
        const uploadResponce = await cloudinary.uploader.upload(image);
        imageURL  = uploadResponce.secure_url;

        //save data to database
        const newBook = new Book({
            title:title,
            caption:caption,
            rating:rating,
            img:imageURL,
            user:req.user._id,
        });
        await newBook.save();
        res.status(201).json(newBook);

    }catch(err){
        console.log(`error: ${err.message}`);
        res.status(401).json({message:err.message});
    }

});


// get recommended books by the logged in user
router.get("/user", authprotected, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 }); // -1 => latest
    res.json(books);
  } catch (error) {
    console.error("Get user books error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// home pagination =>infinite loading
router.get("/",authprotected, async (req,res)=>{
    try{
        //get deatils from user query 
        // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5");
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page-1)*limit;

        //find the books
        const books = await Book.find()
            .sort({createdAT:-1})
            .skip(skip)
            .limit(limit)
            .populate("user","username profile");
        
        const totalBooks = await Book.countDocuments();

        res.status(400).send({
            books:books,
            currentPage:page,
            totalBooks:totalBooks,
            totalPages:Math.ceil(totalBooks/limit), // ceil =>round up a number (5.1 = 6)
        });



    }catch(error){
        console.log("Error in getting all the book routes:",error);
        res.status(500).json("Internal Server Error");
    }
});

router.delete("/:id", authprotected, async (req, res) => {
  try {
    //find the book id 
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // https://res.cloudinary.com/de1rm4uto/image/upload/v1741568358/qyup61vejflxxw8igvi0.png
    // delete image from cloduinary as well
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;