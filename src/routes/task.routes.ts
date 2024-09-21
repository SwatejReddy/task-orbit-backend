import { Router } from "express";
import { createTask, deleteTask, editTask, viewAllTasks } from "../controllers/task.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const taskRouter = Router();

taskRouter.route("/new").post(verifyJWT, createTask);
taskRouter.route("/edit/:id").post(verifyJWT, editTask);
taskRouter.route("/delete/:id").post(verifyJWT, deleteTask);
taskRouter.route("/view/all").get(verifyJWT, viewAllTasks);


export default taskRouter;