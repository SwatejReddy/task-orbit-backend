import ApiResponse, { IApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { loginSchema, signUpSchema } from "../schemas/zodSchemas";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

// generates access token and refresh token and stores it in db
const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        // find the user by user _id
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found!");
        }

        // generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // update the refresh token in the user object
        user.refreshToken = refreshToken;

        // save the refresh token in the database without validating for other fields
        await user.save({ validateBeforeSave: false });

        // return access token and refresh token
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens!");
    }
}

// this is a function to create a user that will be passed to a higher order function (asyncHandler) to handle any errors that may occur.
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    // validate the request body
    const validated = signUpSchema.safeParse(req.body);

    // if the request body is not validated successfully, throw an error
    if (!validated.success) {
        throw new ApiError(400, "Incorrect Inputs!");
    }

    // check if the user already exists
    const userExists = await User.userAlreadyExists(req.body.email, req.body.username);

    // throw an error if the user already exists
    if (userExists) {
        throw new ApiError(409, "User Already Exists!");
    }

    // create a new user
    // const user = new User(req.body);
    const user = await User.create(req.body);

    // make a query to the database to get the user data without password and salt after inserting the user data
    const createdUser = await User.findById(user._id).select("-password -salt -refreshToken");

    // throw an error if the user is not created
    if (!createdUser) {
        throw new ApiError(500, "User not created due to some error!");
    }

    // return the user data without password and salt
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Created!")
    );

})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    // parse request body with zod schema
    // find the user
    // password check
    // generate access token & send in cookie
    // generate refresh token & send in cookie & save in db

    const body = req.body;

    // validate the request body using zod schema
    const validated = loginSchema.safeParse(body);

    // throw an error if the request body is not validated successfully
    if (!validated) {
        throw new ApiError(400, "Incorrect Inputs!");
    }

    // find the user in the database
    const user = await User.findOne({ username: body.username });

    // throw an error if the user is not found
    if (!user) {
        throw new ApiError(404, "User not found!");
    }

    // check if the password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(body.password);

    // throw an error if the password is incorrect
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect Password!");
    }

    // generate access token
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -salt -refreshToken");

    // configure the options for the cookie (makes them non-accessible by javascript)
    const options = {
        httpOnly: true,
        secure: true,
    }

    // return cookies with the access token and refresh token
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, loggedInUser, "Logged In!")
        );
})

const logoutUser = asyncHandler(async (req: Request, res: Response) => {

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:
            {
                refreshToken: ""
            }
        },
        {
            validateBeforeSave: false
        });

    const cookieOptions = {
        httpsOnly: true,
        secure: true
    }

    // clear the cookies
    return res.status(200).clearCookie("accessToken", cookieOptions).clearCookie("refreshToken", cookieOptions).json(new ApiResponse(200, {}, "Logged Out!"));

})

const refreshTokens = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "No Refresh Token found!");
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new ApiError(500, "Refresh Token Secret not found!");
    }

    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decodedRefreshToken === null || typeof decodedRefreshToken === 'string') {
        throw new ApiError(401, "Invalid Access Token!");
    }

    const userId = decodedRefreshToken?._id;
    // const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not found!");
    }

    const storedRefreshToken = await User.findById(userId).select("refreshToken");

    if (!storedRefreshToken) {
        throw new ApiError(401, "User not found!");
    }

    if (incomingRefreshToken !== storedRefreshToken.refreshToken) {
        throw new ApiError(401, "Invalid Refresh Token! Login again!");
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(userId);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "Access and refresh tokens refreshed!"));
})

export { registerUser, loginUser, logoutUser, refreshTokens };