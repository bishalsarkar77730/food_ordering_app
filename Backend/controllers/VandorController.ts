import { Request, Response, NextFunction } from "express";
import { EditVandorInput, VandorLoginInputs } from "../dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food } from "../models";
import { GenerateSignature, validatePasswors } from "../utility";
import { FindVandor } from "./AdminController";

export const Vandorlogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInputs>req.body;
  const existingVandor = await FindVandor("", email);
  if (existingVandor !== null) {
    // validation and give access
    const validation = await validatePasswors(
      password,
      existingVandor.password,
      existingVandor.salt
    );
    if (validation) {
      const signature = GenerateSignature({
        _id: existingVandor.id,
        email: existingVandor.email,
        foodType: existingVandor.foodType,
        name: existingVandor.name,
      });
      return res.json({ signature, existingVandor });
    } else {
      return res.json({ message: "password is not valid" });
    }
  }
  return res.json({ message: "Login credentials not valid" });
};

export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    return res.json(existingVandor);
  }
  return res.json({ message: "Vandor is not found" });
};

export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, foodType, address, phone } = <EditVandorInput>req.body;
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      existingVandor.name = name;
      existingVandor.address = address;
      existingVandor.phone = phone;
      existingVandor.foodType = foodType;

      const savedResult = await existingVandor.save();
      return res.json(savedResult);
    }
    return res.json(existingVandor);
  }
  return res.json({ message: "Vandor is not found" });
};

export const UpdateVandorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vandor = await FindVandor(user._id);
    if (vandor != null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);
      vandor.coverImages.push(...images);
      const result = await vandor.save();
      return res.json(result);
    }
  }
  return res.json({ message: "Something went Wrong with Add food" });
};

export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      const savedResult = await existingVandor.save();
      return res.json(savedResult);
    }
    return res.json(existingVandor);
  }
  return res.json({ message: "Vandor is not found" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { name, description, category, foodtype, readyTime, price } = <CreateFoodInputs>req.body;
    const vandor = await FindVandor(user._id);
    if (vandor != null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);
      const createdFood = await Food.create({
        vandorId: vandor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodtype,
        images: images,
        readyTime: readyTime,
        price: price,
        rating: 0,
      });
      vandor.foods.push(createdFood);
      const result = await vandor.save();
      return res.json(result);
    }
  }
  return res.json({ message: "Something went Wrong with Add food" });
};

export const GetFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vandorId: user._id });
    if (foods !== null) {
      return res.json(foods);
    }
  }
  return res.json({ message: "Food is not found" });
};
