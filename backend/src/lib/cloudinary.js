import {v2 as cloudinary} from "cloudinary";
import "dotenv/config";

//upload and del images in cloudinary
cloudinary.config({
    cloud_name: process.envCLOUDINAY_CLOUD_NAME,
    api_key:process.env.CLOUDINAY_API_KEY,
    api_secrect:process.env.CLOUDINAY_SECRECT,
});

export default cloudinary;