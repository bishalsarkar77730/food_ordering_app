import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GenerateSalt, GenratePassword } from "../utility";

export const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    OwnerName,
    foodType,
    pincode,
    address,
    phone,
    email,
    password,
  } = <CreateVandorInput>req.body;

  const existingvandorEmail = await Vandor.findOne({email: email})
  const existingvandorPhone = await Vandor.findOne({ phone: phone });

  if(existingvandorEmail != null){
    return res.json({"message": "A vander is exist with this email id"})
  }
  if (existingvandorPhone != null) {
    return res.json({ message: "A vander is exist with this Phone number" });
  }

//   Genrate the salt
const salt = await GenerateSalt()
const userPassword = await GenratePassword(password, salt);

  const CreateVandor = await Vandor.create({
    name: name,
    OwnerName: OwnerName,
    foodType: foodType,
    pincode: pincode,
    address: address,
    phone: phone,
    email: email,
    password: userPassword,
    salt: salt,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });

  return res.json(CreateVandor);
};

export const GetVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetVandorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
