import {v2 as cloudinary} from "cloudinary";
import "dotenv/config";

//upload and del images in cloudinary
// upload and delete images in cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
  api_key: process.env.CLOUDINARY_API_KEY,        
  api_secret: process.env.CLOUDINARY_API_SECRET,  
});
console.log("Cloudinary ENV check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "✓" : "❌",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✓" : "❌",
});
export default cloudinary;