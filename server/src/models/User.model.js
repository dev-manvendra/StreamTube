import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const UserSchema = mongoose.Schema({

    username : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },

    email : {
        type: String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true,
       
    },

    password : {
        type: String,
        required : true
    },

    fullname : {
        type: String,
        required : true,
        lowercase : true,
        trim : true,
        index : true
        
    },
    avatar : {
        type : String,
        required : true,
        
    },
    coverImage : String,

    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ]

},{timestamps : true});

UserSchema.pre("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
    
})

UserSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
    
}

UserSchema.methods.getAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
        },
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
       }

    )
}
UserSchema.methods.getRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
        },
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
       }

    )
}

export const User = mongoose.model("User", UserSchema);


