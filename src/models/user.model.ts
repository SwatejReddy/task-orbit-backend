import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../schemas/types";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    salt: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    name: {
        type: String,
        trim: true,
        maxlength: 50
    }
}, {
    timestamps: true
});


// middleware that runs before saving the data to the db (for storing changing password into hashed password)
userSchema.pre("save", async function (next) {
    const user = this as IUser;

    // if password is not modified on any save of the userSchema data, skip this middleware
    if (!user.isModified("password")) return next();

    // generate a salt
    const salt = await bcrypt.genSalt(10);
    // to store the salt in db
    user.salt = salt;

    // hash the password with the salt
    user.password = await bcrypt.hash(user.password, salt);
    next();
})


userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    // takes salt from db and hashes the password
    const hashedPassword = await bcrypt.hash(password, this.salt);
    // takes the hashed password and compares it with the already salted & hashed password in the db
    return await bcrypt.compare(hashedPassword, this.password);
}

userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET || (() => { throw new Error('ACCESS_TOKEN_SECRET is not defined'); })(),
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '60m'
        }
    )
}

userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET || (() => { throw new Error('REFRESH_TOKEN_SECRET is not defined'); })(),
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '1d'
        }
    )
}

export const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', userSchema);

export default User;