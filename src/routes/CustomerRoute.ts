import express, { Request, Response, NextFunction } from "express";
import {
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOtp,
} from "../controllers";
import { Aunthenticate } from "../middlewares";

const router = express.Router();

// Signup/ Create Customer
router.post("/signup", CustomerSignup);
// Login
router.post("/login", CustomerLogin);

//  Below all are Authenticated Routes
router.use(Aunthenticate)
// Verify Customer Account
router.patch("/verify", CustomerVerify);
// OTP/ Requesting OTP
router.get("/otp", RequestOtp);
// Profile
router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);
// Cart
// Order
// Payment

export { router as CustomerRoute };
