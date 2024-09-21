import { Router } from "express";
import { createTask } from "../controllers/task.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const taskRouter = Router();

taskRouter.route("/new").post(verifyJWT, createTask);


export default taskRouter;