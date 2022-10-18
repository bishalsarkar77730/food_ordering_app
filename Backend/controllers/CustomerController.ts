import express, { Request, Response, NextFunction } from "express";
import { Validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateCustomerInputs } from "../dto/Customer.dto";

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {}

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {}

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {}

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};