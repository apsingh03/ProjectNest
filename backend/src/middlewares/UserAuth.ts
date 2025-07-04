import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");

import { UserAuth } from "../models/";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Middleware ------  authenticateUser  ");
    const token = req.header("Authorization");

    const userObject = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("userObject - ");
    const query = await UserAuth.findByPk(userObject.id).then((user: any) => {
      if (user === null) {
        return res
          .status(401)
          .json({ success: false, error: "User Authentication Failed" });
      } else {
        console.log("Middleware SUCCESS ------  authenticateUser  ");
        req.user = userObject;
        next();
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
    // throw new Error(error);
  }
};
