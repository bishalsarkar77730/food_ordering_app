import express, { Request, Response, NextFunction } from "express";
import { foodDoc, Offer, Vandor } from "../models";

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
) => {
  const pincode = req.params.pincode;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort({ rating: "descending" })
    .limit(10);

  if (result.length > 0) {
    res.status(200).json(result);
  } else {
    return res.status(400).json({ message: "Data Not Found" });
  }
};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
  .populate("foods")

  if (result.length > 0) {
    let foodResult: any = [];
    result.map(vandor => {
      const foods = vandor.foods as [foodDoc]
      foodResult.push(...foods.filter(food => food.readyTime <= 30))
    })
    res.status(200).json(foodResult);
  } else {
    return res.status(400).json({ message: "Data Not Found" });
  }
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];
    result.map(item => foodResult.push(item.foods))
    res.status(200).json(foodResult);
  } else {
    return res.status(400).json({ message: "Data Not Found" });
  }
};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const result = await Vandor.findById(id).populate("foods")
  if (result) {
    res.status(200).json(result);
  } else {
    return res.status(400).json({ message: "Data Not Found" });
  }
};

export const GetOffersbyPin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const offers = await Offer.find({pincode: pincode, isActive: true});
  if(offers){
    return res.status(200).json(offers)
  }
  return res.status(400).json({message:"Data not Found"});
}