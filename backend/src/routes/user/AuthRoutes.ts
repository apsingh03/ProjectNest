import { Router, Request, Response } from "express";
import {
  clientSignUp,
  clientLogIn,
  clientLoggedInfo,
  clientLogout,
} from "../../controller/User/UserController";
import { authenticateUser } from "../../middlewares/UserAuthMiddleware";
const router = Router();

// Example route
router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Auth Home");
});

// localhost:8000/auth/signup
router.post("/signup", clientSignUp);
router.post("/login", clientLogIn);
router.get("/loggedInfo", authenticateUser, clientLoggedInfo);

export default router;
