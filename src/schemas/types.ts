import { Types, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    salt: string;
    refreshToken: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    // Instance methods
    isPasswordCorrect(password: string): Promise<boolean>;
    generateRefreshToken(): string;
    generateAccessToken(): string;
}

export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'To Do' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    dueDate?: Date;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// types/express.d.ts
// import { UserDocument } from "../models/user.model"; // Adjust path according to your setup


declare global {
    namespace Express {
        interface Request {
            user?: IUser; // Use your User type here
        }
    }
}
