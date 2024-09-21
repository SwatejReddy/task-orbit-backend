import mongoose, { Schema } from "mongoose";
import { ITask } from "../schemas/types";


const taskSchema: Schema<ITask> = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'],
        default: 'To Do'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    dueDate: {
        type: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true
});

const Task = (mongoose.models.Task as mongoose.Model<ITask>) || mongoose.model<ITask>('Task', taskSchema);


export default Task;