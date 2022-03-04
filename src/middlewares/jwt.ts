import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "./../errors/app-error";

// export const verifyToken = (req: Request, res: Response, next: any) => {
//   let bearerToken = req.headers["Authorization"] as string;
//   bearerToken = bearerToken.replace("Bearer ", "");

//   if (!bearerToken) {
//     return res.status(400).send(new AppError(NO_TOKEN, 500));
//   }
//   const secret = process.env.API_SECRET;
//   if (!secret || secret.length < 1)
//     return res.status(500).json(new AppError(INTERNAL_ERROR, 500));

//   jwt.verify(bearerToken, secret, (err, decoded) => {
//     if (err) {
//       return res.status(401).send(new AppError(NOT_AUTHORIZED, 401));
//     }
//     if (decoded) req.body.userId = decoded.userId;
//     next();
//   });
// };
