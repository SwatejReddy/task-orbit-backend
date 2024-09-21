import { IApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

// this is a function to create a user that will be passed to a higher order function (asyncHandler) to handle any errors that may occur.
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ message: "User created successfully" });
})

export { registerUser }