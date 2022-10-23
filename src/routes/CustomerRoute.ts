import express, { Request, Response, NextFunction } from "express";
import {
  addToCart,
  CreateOrder,
  CreatePayment,
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  DeleteCart,
  EditCustomerProfile,
  GetCart,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
  RequestOtp,
  VerifyOffer,
} from "../controllers";
import { Aunthenticate } from "../middlewares";

const router = express.Router();

// Signup/ Create Customer
router.post("/signup", CustomerSignup);
// Login
router.post("/login", CustomerLogin);

//  Below all are Authenticated Routes
router.use(Aunthenticate);
// Verify Customer Account
router.patch("/verify", CustomerVerify);
// OTP/ Requesting OTP
router.get("/otp", RequestOtp);
// Profile
router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);
// Cart
router.post("/cart", addToCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);

// Apply Offers
router.get("/offer/verify/:id", VerifyOffer);

// Payment
router.post("/create-payment", CreatePayment);

// Order
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderById);

export { router as CustomerRoute };
