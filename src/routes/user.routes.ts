import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);

// secured routes

userRouter.route("/login").post(verifyJWT, loginUser);

export default userRouter;