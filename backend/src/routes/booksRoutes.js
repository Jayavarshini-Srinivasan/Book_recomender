// src/routes/booksRoutes.js
import "dotenv/config";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import Book from "../models/book.js";
import authProtected from "../middleware/authmiddleware.js";

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------- CREATE BOOK -------------------
router.post("/", authProtected, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image)
      return res.status(400).json({ message: "Fill all the details" });

    // Upload base64 image directly (frontend should send full data URL)
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "books",
    });

    // Save book in database
    const newBook = new Book({
      title,
      caption,
      rating: Number(rating),
      image: uploadResponse.secure_url,
      cloudinaryId: uploadResponse.public_id, // save for deletion
      user: req.user._id,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error("Error creating book:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------- GET USER BOOKS -------------------
router.get("/user", authProtected, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error("Get user books error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- GET ALL BOOKS WITH PAGINATION -------------------
router.get("/", authProtected, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profile");

    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ------------------- DELETE BOOK -------------------
router.delete("/:id", authProtected, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check ownership
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // Delete image from Cloudinary
    if (book.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(book.cloudinaryId);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
