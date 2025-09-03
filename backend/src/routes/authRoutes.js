import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
const router = express.Router();

function genToken(userId){
    return jwt.sign({userId},process.env.SECRET_TOKEN, {expiresIn:"15d"});
}
router.post("/register", async(req,res)=>{
    try{

        //user field checking
        const {username,email,password} = req.body;
        if (!username || !email || !password){
            return res.status(400).json({message:"Fill all the Fields"});
        }
        if (password.length < 6) return res.status(400).json({message:"Password length shouls be greater than 6"});

        // check if the user is already in the database 
        const exists_email = await User.findOne({email:email});
        if(exists_email) return res.status(400).json({message:"Email already exists"});

        const exists_username = await User.findOne({username:username});
        if(exists_username) return res.status(400).json({message:"Username already exists"});

        // create user
        const profile_pic = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        const user = new User({
            username: username,
            email:email,
            password:password,
            profile:profile_pic
        })
        
        //save the user to the database
        await user.save()

        const token = genToken(user._id);

        // send the created user to the client

        res.status(201).json({token,
            user:{
                id : user._id,
                email:user.email,
                username:user.username,
                profile:user.profile

            },
        });

   }catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async(req,res)=>{
    
    try{
        const {email , password} = req.body;
        if (!email || !password){
            return res.status(400).json({message:"Fill all the fields"});
        }
        
        
        //check email id 
        const user = await User.findOne({email:email});
        if(!user) return res.status(401).json({message:"Invalid Credentials"});

        // check if password is correct
        const passwordcorrect = await user.checkPassword(password);
        if(!passwordcorrect){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        
        // generate token 
        const token = genToken(user._id);

        // send the requried  user to the client

        res.status(200).json({token,
            user:{
                id : user._id,
                email:user.email,
                username:user.username,
                profile:user.profile

            },
        });

        
    }catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;