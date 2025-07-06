import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";

import authRoutes from "./routes/user/AuthRoutes";
import management from "./routes/management/ManagementRoutes";
import taskRoutes from "./routes/task/TaskRoutes";

// Load .env
dotenv.config();

// Express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const corsOptions = {
  origin: process.env.CORS_FRONTEND_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// HTTP server for socket.io or other websockets
const server = http.createServer(app);

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).send("Welcome to Home  Project Management Backend Server");
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});
// Routes
app.use("/auth", authRoutes);
app.use("/project_management", management);
app.use("/project_task", taskRoutes);

// Listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Listening on http://localhost:${PORT}`);
});
