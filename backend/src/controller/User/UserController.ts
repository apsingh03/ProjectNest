import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserAuth } from "../../models";
import { MyJwtPayload } from "../../types/express";

const isProduction = process.env.NODE_ENV === "production";

export const clientSignUp = async (
  req: Request<{}, {}, { email: string; password: string; fullName: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // console.log("User Req.body - ", req.body);
    const emailExistQuery = await UserAuth.findOne({
      where: { email: req.body.email },
    });
    // console.log("-------- 16 ");
    if (emailExistQuery) {
      // console.log("checjing  an account ");
      if (emailExistQuery.email === req.body.email) {
        res.status(200).send({ msg: "Email Already Exist" });
      }
    } else {
      // console.log("creating an account ");
      const saltRounds = 10;

      bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
        if (err) {
          // console.log("Bcrypt error: ", err);
          res.status(500).send({ msg: "Error hashing password" });
        }
        const query = await UserAuth.create({
          fullName: req.body.fullName,
          email: req.body.email,
          password: hash,
          // createdAt: Date.now(),
        });

        res.status(200).send({ msg: "Sign Up Successful" });
      });
    }
    // console.log("---- 37");
  } catch (error: any) {
    // console.log("createUser Error - ", error);
    res.status(500).send({ error: error.message });
  }
};

export const clientLogIn = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // console.log(" ------------------   clientLogIn Req - ");
    const emailExistQuery = await UserAuth.findOne({
      where: { email: req.body.email },
    });

    if (emailExistQuery) {
      bcrypt.compare(
        req.body.password,
        emailExistQuery.password,
        function (err, result) {
          if (err) {
            res.status(500).send({ msg: "Something went wrong" });
          }

          if (result) {
            const { id, fullName, email } = emailExistQuery;
            const userObject = {
              isUserLogged: true,
              id,
              fullName,
              email,
            };

            var token = jwt.sign(userObject, process.env.JWT_SECRET_KEY!);

            res
              .status(200)
              .send({ msg: "Logged In Successfull", token, userObject });
          } else {
            res.status(200).send({ msg: "Password Wrong" });
          }
        }
      );
    } else {
      res.status(200).send({ msg: "Incorrect Email" });
    }
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const clientLoggedInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ success: false, error: "No token provided" });
    }

    const userObject = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as MyJwtPayload;

    // console.log("userObject - ", userObject);
    const userObjectId = userObject.id;

    const user = await UserAuth.findByPk(userObjectId);

    if (!user) {
      res
        .status(401)
        .json({ success: false, error: "User Authentication Failed" });
    }
    res.status(200).send({ msg: "User Logged In", userObject });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};
