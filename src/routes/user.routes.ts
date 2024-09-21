import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post();

export default userRouter;