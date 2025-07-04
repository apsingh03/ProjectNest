import { Router, Request, Response } from "express";

import { authenticateUser } from "../../middlewares/UserAuth";
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../../controller/task/Task";
const router = Router();

// Example route
router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Task Management ");
});

router.get("/task", authenticateUser, getTask);
router.post("/task", authenticateUser, createTask);
router.put("/task/:id", authenticateUser, updateTask);
router.delete("/task/:id", authenticateUser, deleteTask);

export default router;
