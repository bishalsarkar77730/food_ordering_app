import { Request, Response, NextFunction } from "express";
import { CreateOfferInputs, EditVandorInput, VandorLoginInputs } from "../dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food, Offer, Order, Vandor } from "../models";
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
  const {lat, lng} = req.body
  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      if(lat && lng){
        existingVandor.lat = lat;
        existingVandor.lng = lng;
      }
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
    const { name, description, category, foodtype, readyTime, price } = <
      CreateFoodInputs
    >req.body;
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

export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );
    if (orders != null) {
      return res.status(200).json(orders);
    }
  }
  return res.json({ message: "order not found" });
};

export const GetCurrentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    if (order != null) {
      return res.status(200).json(order);
    }
  }
  return res.json({ message: "order not found" });
};

export const ProcessOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const { status, remarks, time } = req.body;
  if (orderId) {
    const order = await Order.findById(orderId).populate("food");
    order.orderStatus = status;
    order.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }
    const orderResult = await order.save();
    if (orderResult !== null) {
      return res.status(200).json(orderResult);
    }
  }
  return res.json({ message: "Unable to process Order!" });
};

export const GetOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    let currentOffers = Array();
    const offers = await Offer.find().populate("vendors");
    if (offers) {
      offers.map((item) => {
        if (item.vendors) {
          item.vendors.map((Vandor) => {
            if (Vandor.id.toString() === user._id) {
              currentOffers.push(item);
            }
          });
        }
        if (item.offerType === "GENERIC") {
          currentOffers.push(item);
        }
      });
    }
    return res.status(200).json(currentOffers);
  }
  return res.status(400).json({ message: "unable to get Offers" });
};

export const AddOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const {
      offerType,
      title,
      description,
      minValue,
      offerAmount,
      startValidity,
      endValidity,
      promocode,
      promoType,
      bank,
      bins,
      pincode,
      isActive,
    } = <CreateOfferInputs>req.body;
    const vandor = await FindVandor(user._id);
    if (vandor) {
      const offer = await Offer.create({
        offerType,
        title,
        description,
        minValue,
        offerAmount,
        startValidity,
        endValidity,
        promocode,
        promoType,
        bank,
        bins,
        pincode,
        isActive,
        vendors: [vandor],
      });
      return res.status(200).json(offer);
    }
  }
  return res.status(404).json({ message: "unable to create offer" });
};

export const EditOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const offerId = req.params.id;
  if (user) {
    const {
      offerType,
      title,
      description,
      minValue,
      offerAmount,
      startValidity,
      endValidity,
      promocode,
      promoType,
      bank,
      bins,
      pincode,
      isActive,
    } = <CreateOfferInputs>req.body;
    const currentOffer = await Offer.findById(offerId)
    if(currentOffer){
      const vandor = await FindVandor(user._id);
      if (vandor) {
        currentOffer.offerType = offerType,
        currentOffer.title = title,
        currentOffer.description = description,
        currentOffer.minValue = minValue,
        currentOffer.offerAmount = offerAmount,
        currentOffer.startValidity = startValidity,
        currentOffer.endValidity = endValidity,
        currentOffer.promocode = promocode,
        currentOffer.promoType = promoType,
        currentOffer.bank = bank,
        currentOffer.bins = bins,
        currentOffer.pincode = pincode,
        currentOffer.isActive = isActive

        const result = await currentOffer.save()
        return res.status(200).json(result)
      }
    }
  }
  return res.status(404).json({ message: "unable to create offer" });
};
