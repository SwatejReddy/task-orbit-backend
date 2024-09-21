import { Types, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    salt: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
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

// export interface IApiResponse {
//     statusCode: number;
//     data: any,
//     message: string;
//     success: boolean;
// }
