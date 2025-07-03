import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";

// Load .env
dotenv.config();

// Express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// CORS
const corsOptions = {
  origin: process.env.CORS_FRONTEND_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// HTTP server for socket.io or other websockets
const server = http.createServer(app);

// Routes
import authRoutes from "./routes/user/";
import management from "./routes/management/";
app.use("/auth", authRoutes);
app.use("/project_management", management);

// app.get("/", (req: Request, res: Response) => {
//   try {
//     res.status(200).send("Welcome to Project Management");
//   } catch (error: any) {
//     res.status(500).send({ error: error.message });
//   }
// });

// Listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Listening on http://localhost:${PORT}`);
});
