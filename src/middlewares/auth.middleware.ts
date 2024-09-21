import ApiError from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";

// takes access token from the request and verifies it and adds the user details to the request object
export const verifyJWT = asyncHandler(async (req: Request, _, next: NextFunction) => {
    try {
        // extract the access token from cookie or the header
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

        if (!accessToken) {
            throw new ApiError(401, "Access Token not found!");
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || (() => { throw new Error('ACCESS_TOKEN_SECRET is not defined'); })());

        if (decodedToken === null || typeof decodedToken === 'string') {
            throw new ApiError(401, "Invalid Access Token!");
        }

        // find the user in the database

        const user = await User.findById(decodedToken?._id).select("-password -salt -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token!");
        }
        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token!");
    }
})