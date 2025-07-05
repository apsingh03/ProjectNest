import { Router, Request, Response } from "express";

import { authenticateUser } from "../../middlewares/UserAuthMiddleware";
import {
  createProject,
  deleteProject,
  getProject,
  updateProject,
} from "../../controller/management/ProjectManagementController";
const router = Router();

// Example route
router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Project Management ");
});

// localhost:8000/auth/signup
router.get("/project", authenticateUser, getProject);
router.post("/project", authenticateUser, createProject);
router.put("/project/:id", authenticateUser, updateProject);
router.delete("/project/:id", authenticateUser, deleteProject);

export default router;
