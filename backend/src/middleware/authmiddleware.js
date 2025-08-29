import jwt from "jsonwebtoken";
import user from "../models/user.js";


const authprotected = async(req,res,next)=>{
    try{

        //get token
        const token = req.header("Authorization").replace("Bearer ","");
        
        //check token
        if(!token) return res.status(401).json({message:"No authentication token Access denied"});

        //verify token
        const decoded = jwt.verify(token,process.env.SECRET_TOKEN);
        //find user 
        const user = await user.findById(decoded.userId).select("-password");

        if(!user) return res.status(401).json({message:"token is nor valid"});

        req.user = user;
        next();

    }catch(error){
        res.status(401).json("Error : ",error.message)
    }
}

export default authprotected;