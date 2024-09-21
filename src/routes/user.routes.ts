import { Router } from "express";
import { loginUser, logoutUser, refreshTokens, registerUser } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);

// secured routes

userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshTokens)


export default userRouter;