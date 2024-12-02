import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createUserIntoDB = async (payload: any) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This user already exist!");
  }

  // hashed password
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });

  return result;
};

export { createUserIntoDB };
