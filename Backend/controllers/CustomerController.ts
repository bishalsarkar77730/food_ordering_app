import express, { Request, Response, NextFunction } from "express";
import { validate, Validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateCustomerInputs } from "../dto";
import { GenerateOtp, GenerateSalt, GenerateSignature, GenratePassword, onRequestOTP } from "../utility";
import { Customer } from "../models";

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }
  const { email, phone, password } = customerInputs;
  const salt = await GenerateSalt();
  const userPassword = await GenratePassword(password, salt);
  const {otp, expiry} = GenerateOtp();
  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
  });
  if(result){
    // send the OTP to customer
    await onRequestOTP(otp, phone)
    //  generate the signature
    // const signature = GenerateSignature()
    //  send the result to client
  }
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

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
