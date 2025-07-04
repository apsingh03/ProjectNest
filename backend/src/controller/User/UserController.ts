import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserAuth } from "../../models";
import Cookies from "js-cookie";

const isProduction = process.env.NODE_ENV === "production";
const cookieSettings = {
  httpOnly: true,
  secure: false,
  sameSite: "strict",
  path: "/",
};
export const clientSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("User Req.body - ", req.body);
    const emailExistQuery = await UserAuth.findOne({
      where: { email: req.body.email },
    });
    console.log("-------- 16 ");
    if (emailExistQuery) {
      console.log("checjing  an account ");
      if (emailExistQuery.email === req.body.email) {
        return res.status(200).send({ msg: "Email Already Exist" });
      }
    } else {
      console.log("creating an account ");
      const saltRounds = 10;

      bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
        if (err) {
          console.log("Bcrypt error: ", err);
          return res.status(500).send({ msg: "Error hashing password" });
        }
        const query = await UserAuth.create({
          fullName: req.body.fullName,
          email: req.body.email,
          password: hash,
          // createdAt: Date.now(),
        });

        return res.status(200).send({ msg: "Sign Up Successful" });
      });
    }
    console.log("---- 37");
  } catch (error) {
    // console.log("createUser Error - ", error);
    return res.status(500).send({ error: error.message });
  }
};

export const clientLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(" ------------------   clientLogIn Req - ");
    const emailExistQuery = await UserAuth.findOne({
      where: { email: req.body.email },
    });

    if (emailExistQuery) {
      bcrypt.compare(
        req.body.password,
        emailExistQuery.password,
        function (err, result) {
          if (err) {
            return res.status(500).send({ msg: "Something went wrong" });
          }

          if (result) {
            const { id, fullName, email } = emailExistQuery;
            const userObject = {
              isUserLogged: true,
              id,
              fullName,
              email,
            };

            var token = jwt.sign(userObject, process.env.JWT_SECRET_KEY);

            res.cookie("token", token, {
              ...cookieSettings,
              maxAge: 24 * 60 * 60 * 1000,
            });

            return res
              .status(200)
              .send({ msg: "Logged In Successfull", token, userObject });
          } else {
            return res.status(200).send({ msg: "Password Wrong" });
          }
        }
      );
    } else {
      return res.status(200).send({ msg: "Incorrect Email" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const clientLoggedInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "No token provided" });
    }

    const userObject = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // console.log("userObject - ", userObject);

    const user = await UserAuth.findByPk(userObject.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "User Authentication Failed" });
    }
    return res.status(200).send({ msg: "User Logged In", userObject });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const clientLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("----- clientLogout");
    res.clearCookie("token", cookieSettings);
    console.log("----- clientLogout  ------------------ ");
    return res.status(200).json({ msg: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};
