import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { taskSchema } from "../schemas/zodSchemas";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import Task from "../models/task.model";

// # Routes:

// ## Task Routes:

// - /task

// - [ ]  Create a task : /new

// - [ ]  Edit a task : /edit/:id

// - [ ]  Delete a task : /delete/:id

// - [ ]  View all tasks : /view/all 

const createTask = asyncHandler(async (req: Request, res: Response) => {

    // const {title, description, status, priority, dueDate} = req.body;
    const validated = taskSchema.safeParse(req.body);

    if (!validated.success) {
        throw new ApiError(400, "Validation Error");
    }

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const newTask = await Task.create({
        ...validated.data,
        user: req.user._id
    })

    if (!newTask) {
        throw new ApiError(500, "Task Creation Failed");
    }

    res
        .status(200)
        .json(new ApiResponse(200, newTask, "Task Created"));

})

export { createTask }