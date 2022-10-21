import express, { Request, Response, NextFunction } from "express";
import { validate, Validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  CreateCustomerInputs,
  UserLoginInputs,
  EditCustomerProfileInputs,
} from "../dto";
import {
  GenerateOtp,
  GenerateSalt,
  GenerateSignature,
  GenratePassword,
  onRequestOTP,
  validatePasswors,
} from "../utility";
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
  const { otp, expiry } = GenerateOtp();
  const existCustomer = await Customer.findOne({ email: email });
  if (existCustomer !== null) {
    return res
      .status(409)
      .json({ message: "An user exist with the provided email" });
  }
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
  if (result) {
    // send the OTP to customer
    await onRequestOTP(otp, phone);
    //  generate the signature
    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    //  send the result to client
    return res.status(201).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }
  return res.status(400).json({ message: "Error with signup" });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);
  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });
  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }
  const { email, password } = loginInputs;
  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const validation = await validatePasswors(
      password,
      customer.password,
      customer.salt
    );
    if (validation) {
      //  generate the signature
      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });
      return res.status(201).json({
        signature: signature,
        verified: customer.verified,
        email: customer.email,
      });
    }
  }
  return res.status(404).json({ message: "Error with login" });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();
        // regenrate the signature
        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });
        //  send the result to client
        return res.status(201).json({
          signature: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }
  return res.status(400).json({ message: "Error with OTP Validation" });
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      const { otp, expiry } = GenerateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;
      await profile.save();
      await onRequestOTP(otp, profile.phone);

      res
        .status(200)
        .json({ message: "OTP sent to your registered mobile number" });
    }
  }
  return res.status(400).json({ message: "Error with sending OTP" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if(customer){
    const profile = await Customer.findById(customer._id)
    if(profile){
      return res.status(200).json(profile)
    }
  }
  return res.status(400).json({message: "Error with fetching the data"})
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });
  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }
  const { firstName, lastName, address } = profileInputs;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();
      res.status(200).json(result);
    }
  }
};
