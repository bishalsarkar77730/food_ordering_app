import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateDeliveryUserInputs,
  EditCustomerProfileInputs,
  UserLoginInputs,
} from "../dto";
import {
  GenerateSalt,
  GenerateSignature,
  GenratePassword,
  validatePasswors,
} from "../utility";
import { DeliveryUser } from "../models";

export const DeliveryUserSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUserInputs = plainToClass(CreateDeliveryUserInputs, req.body);
  const inputErrors = await validate(deliveryUserInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }
  const { email, phone, password, firstName, lastName, Address, pincode } =
    deliveryUserInputs;
  const salt = await GenerateSalt();
  const UserPassword = await GenratePassword(password, salt);

  const existDeliveryUser = await DeliveryUser.findOne({ email: email });
  if (existDeliveryUser !== null) {
    return res
      .status(409)
      .json({ message: "A Delivery user exist with the provided email" });
  }
  const result = await DeliveryUser.create({
    email: email,
    password: UserPassword,
    salt: salt,
    phone: phone,
    firstName: firstName,
    lastName: lastName,
    address: Address,
    pincode: pincode,
    verified: false,
    lat: 0,
    lng: 0,
    isAvailable: false,
  });
  if (result) {
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

export const DeliveryUserLogin = async (
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
  const deliveryUser = await DeliveryUser.findOne({ email: email });
  if (deliveryUser) {
    const validation = await validatePasswors(
      password,
      deliveryUser.password,
      deliveryUser.salt
    );
    if (validation) {
      //  generate the signature
      const signature = GenerateSignature({
        _id: deliveryUser._id,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });
      return res.status(201).json({
        signature: signature,
        verified: deliveryUser.verified,
        email: deliveryUser.email,
      });
    }
  }
  return res.status(404).json({ message: "Error with login" });
};

export const GetDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;
  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);
    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ message: "Error with fetching the data" });
};

export const EditDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;
  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });
  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }
  const { firstName, lastName, address } = profileInputs;
  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();
      res.status(200).json(result);
    }
  }
  return res.status(400).json({ message: "Error with Editing the data" });
};

export const UpdateDeliveryUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;
  if(deliveryUser){
    const {lat, lng} = req.body;
    const profile = await DeliveryUser.findById(deliveryUser._id);
    if(profile){
      if(lat & lng){
        profile.lat;
        profile.lng;
      }
      profile.isAvailable = !profile.isAvailable;
      const result = await profile.save();
      res.status(200).json(result);
    }
  }
  return res.status(400).json({ message: "Error with Updating Status" });
};
