import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { DeliveryUser, Transaction, Vandor } from "../models";
import { GenerateSalt, GenratePassword } from "../utility";

export const FindVandor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vandor.findOne({ email: email });
  } else {
    return await Vandor.findById(id);
  }
};

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

  const existingvandorEmail = await FindVandor("", email);
  const existingvandorPhone = await Vandor.findOne({ phone: phone });

  if (existingvandorEmail != null) {
    return res.json({ message: "A vander is exist with this email id" });
  }
  if (existingvandorPhone != null) {
    return res.json({ message: "A vander is exist with this Phone number" });
  }

  //   Genrate the salt
  const salt = await GenerateSalt();
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
    foods: [],
    lat: 0,
    lng: 0,
  });

  return res.json(CreateVandor);
};

export const GetVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vanders = await Vandor.find();
  if (vanders != null) {
    return res.json(vanders);
  }
  return res.json({ message: "vandors data not available" });
};

export const GetVandorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandorId = req.params.id;
  const vandor = await FindVandor(vandorId);
  if (vandor !== null) {
    return res.json(vandor);
  }
  return res.json({ message: "vandors data not available" });
};

export const GetTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await Transaction.find();
  if (transaction) {
    return res.status(200).json(transaction);
  }
  return res.json({ message: "Transaction not available" });
};

export const GetTransactionsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Id = req.params.id;
  const transaction = await Transaction.findById(Id);
  if (transaction) {
    return res.status(200).json(transaction);
  }
  return res.status(400).json({ message: "Transaction not available" });
};

export const VerifyDeliveryUSer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id, status } = req.body;
  if (_id) {
    const profile = await DeliveryUser.findById(_id);
    if (profile) {
      profile.verified = status;
      const result = await profile.save();
      return res.status(200).json(result);
    }
  }
  return res.status(400).json({ message: "Verification Failed" });
};

export const GetDeliveryUSers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = await DeliveryUser.find();
  if (deliveryUser) {
    return res.status(200).json(deliveryUser);
  }
  return res.status(400).json({ message: "Verification Failed" });
};
