import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CreateDeliveryUserInputs } from "../dto";
import { GenerateSalt, GenratePassword } from "../utility";

export const DeliveryUserSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUserInputs = plainToClass(CreateDeliveryUserInputs, req.body);
  const inputErrors = await validate(deliveryUserInputs, {
    validationError: { target: true },
  });
  if(inputErrors.length > 0){
    return res.status(400).json(inputErrors)
  }
  const { email, phone, password, firstName, lastName, Address, pincode } = deliveryUserInputs;
  const salt = await GenerateSalt()
  const UserPassword = await GenratePassword(password, salt)
};

export const DeliveryUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const EditDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateDeliveryUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
