import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { taskSchema } from "../schemas/zodSchemas";
import Task from "../models/task.model";


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

const editTask = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const task = await Task.findOneAndUpdate({
        _id: id,
        user: req.user._id
    }, {
        title,
        description,
        status,
        priority,
        dueDate
    }, { new: true }) // to return the updated document

    if (!task) {
        throw new ApiError(404, "Task Not Found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, task, "Task Updated"));
})

const deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const task = await Task.findOneAndDelete({
        _id: id,
        user: req.user._id
    })

    if (!task) {
        throw new ApiError(404, "Task Not Found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, task, "Task Deleted"));
})

const viewAllTasks = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized Access");
    }
    console.log("userId: ", req.user._id);

    const tasks = await Task.find({ user: req.user._id });

    if (!tasks) {
        throw new ApiError(404, "No Tasks Found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, tasks, "Tasks Found"));
})

export { createTask, editTask, deleteTask, viewAllTasks }