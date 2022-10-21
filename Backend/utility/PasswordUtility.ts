import { Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";
import { AuthPayload, VandorPayload } from "../dto";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GenratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePasswors = async (
  enteredPassword: string,
  savePassword: string,
  salt: string
) => {
  return (await GenratePassword(enteredPassword, salt)) === savePassword;
};

export const GenerateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = (await jwt.verify(
      signature.split(" ")[1],
      APP_SECRET
    )) as AuthPayload;
    req.user = payload;
    return true;
  }
  return false;
};
