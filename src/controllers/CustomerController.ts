import express, { Request, Response, NextFunction } from "express";
import { validate, Validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  CreateCustomerInputs,
  UserLoginInputs,
  EditCustomerProfileInputs,
  OrderInputs,
  CartItem,
} from "../dto";
import {
  GenerateOtp,
  GenerateSalt,
  GenerateSignature,
  GenratePassword,
  onRequestOTP,
  validatePasswors,
} from "../utility";
import {
  Customer,
  DeliveryUser,
  Food,
  Offer,
  Order,
  Transaction,
  Vandor,
} from "../models";

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
    orders: [],
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
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ message: "Error with fetching the data" });
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
  return res.status(400).json({ message: "Error with Editing the data" });
};

// Cart Section

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    let cartItems = Array();
    const { _id, unit } = <CartItem>req.body;
    const food = await Food.findById(_id);
    if (food) {
      if (profile != null) {
        //  Check for cart items
        cartItems = profile.cart;
        if (cartItems.length > 0) {
          //  check and update the unit
          let existFoodItem = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );
          if (existFoodItem.length > 0) {
            const index = cartItems.indexOf(existFoodItem[0]);
            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          // add new item to cart
          cartItems.push({ food, unit });
        }
        if (cartItems) {
          profile.cart = cartItems as any;
          const cartresult = await profile.save();
          return res.status(200).json(cartresult.cart);
        }
      }
    }
  }
  return res.status(400).json({ message: "Unable to create Cart" });
};

export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }
  return res.status(400).json({ message: "cart is empty" });
};

export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile != null) {
      profile.cart = [] as any;
      const cartResult = await profile.save();
      return res.status(200).json(cartResult);
    }
  }
  return res.status(400).json({ message: "cart is already empty" });
};

// ********************** Create Payment ************************

export const CreatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const { amount, paymentMode, offerId } = req.body;
  let payableAmount = Number(amount);
  if (offerId) {
    const appliedOffer = await Offer.findById(offerId);
    if (appliedOffer) {
      if (appliedOffer.isActive) {
        payableAmount = payableAmount - appliedOffer.offerAmount;
      }
    }
  }
  //  Perform Payment gateway Charge API call
  // create record on transaction
  const transaction = await Transaction.create({
    customer: customer._id,
    vendorId: "",
    orderId: "",
    orderValue: payableAmount,
    offerUsed: offerId || "NA",
    status: "OPEN",
    paymentMode: paymentMode,
    paymentResponse: "Payment is cash on Delivery",
  });

  //return transaction
  return res.status(200).json(transaction);
};

// Delivery Notification

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {
  // Find The vendor
  const vendor = await Vandor.findById(vendorId);
  if (vendor) {
    const areaCode = vendor.pincode;
    const vendorLat = vendor.lat;
    const vendorLng = vendor.lng;
    //  Find the Available Delivery Person
    const deliveryPerson = await DeliveryUser.find({
      pincode: areaCode,
      verified: true,
      isAvailable: true,
    });
    if (deliveryPerson) {
      //  Check the nearest Delivery person and assign the order
      const currentOrder = await Order.findById(orderId);
      if (currentOrder) {
        //  Update DeliveryID
        currentOrder.deliveryId = deliveryPerson[0]._id;
        await currentOrder.save();
        // Notify to vendor for received New Order Using firebase Push Notification
      }
    }
  }
};

// Order Section

const validateTransaction = async (txnId: string) => {
  const currentTransaction = await Transaction.findById(txnId);
  if (currentTransaction) {
    if (currentTransaction.status.toLowerCase() !== "failed") {
      return { status: true, currentTransaction };
    }
  }
  return { status: false, currentTransaction };
};

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current login customer
  const customer = req.user;
  const { txnId, amount, items } = <OrderInputs>req.body;

  if (customer) {
    // Validate Transaction
    const { status, currentTransaction } = await validateTransaction(txnId);
    if (!status) {
      return res.status(404).json({ message: "Error with Create Order" });
    }
    // create an order Id
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
    const profile = await Customer.findById(customer._id);
    // Grab order items from request [ { id: XX, unit: Xx}]
    let cartItems = Array();
    let netAmount = 0.0;
    let vandorId;
    // Calculate order amount
    const foods = await Food.find()
      .where("_id")
      .in(items.map((item) => item._id))
      .exec();
    foods.map((food) => {
      items.map(({ _id, unit }) => {
        if (food._id == _id) {
          vandorId = food.vandorId;
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });
    // Create Order With Item Description
    if (cartItems) {
      // Create Order
      const currentOrder = await Order.create({
        orderId: orderId,
        vandorId: vandorId,
        items: cartItems,
        totalAmount: netAmount,
        paidAmount: amount,
        orderDate: new Date(),
        orderStatus: "Waiting",
        remarks: "",
        deliveryId: "",
        readyTime: 45,
      });
      //  Update orders to user Account
      profile.cart = [] as any;
      profile.orders.push(currentOrder);

      currentTransaction.vendorId = vandorId;
      currentTransaction.orderId = orderId;
      currentTransaction.status = "CONFIRMED";
      await currentTransaction.save();
      assignOrderForDelivery(currentOrder._id, vandorId);
      const profileSaveResponse = await profile.save();
      return res.status(200).json(profileSaveResponse);
    } else {
      return res.status(400).json({ message: "Unable to create orders" });
    }
  }
  return res.status(400).json({ message: "Error with Create order!" });
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");
    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }
  return res.status(404).json({ message: "error getting orders" });
};

export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    return res.status(200).json(order);
  }
  return res.status(404).json({ message: "error getting order" });
};

export const VerifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offerId = req.params.id;
  const customer = req.user;
  if (customer) {
    const appliedOffer = await Offer.findById(offerId);
    if (appliedOffer) {
      if (appliedOffer.promoType === "USER") {
        // only can apply once per User
      } else {
        if (appliedOffer.isActive) {
          return res
            .status(200)
            .json({ message: "Offer is Valid", Offer: appliedOffer });
        }
      }
    }
  }
  return res.status(404).json({ message: "error Verifying offer" });
};
