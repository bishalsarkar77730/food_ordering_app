import express, { Request, Response, NextFunction } from "express";
import { Vandor } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort({ rating: "descending" })
    .populate("foods");

  if (result.length > 0) {
    res.status(200).json(result);
  } else {
    return res.status(400).json({ message: "Data Not Found" });
  }
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
