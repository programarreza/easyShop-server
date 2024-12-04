import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../config";
import AppError from "../error/AppError";
import { verifyToken } from "../helpers/jwtHelpers";

const auth = (...roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = verifyToken(
        token,
        config.jwt_access_secret as Secret
      );

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(StatusCodes.FORBIDDEN, "Forbidden!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
