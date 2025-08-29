import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    profile:{
        type:String,
        default:"",
    }
});

// hashing the password for security
userSchema.pre("save" , async function(next) {
    if (!this.isModified("password")) return next(); 

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

// check if the password is correct

userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password , this.password);
};
const User = mongoose.model("User",userSchema);
export default User;