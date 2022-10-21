import express, { Request, Response, NextFunction } from "express";
import {
  CreateOrder,
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
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
// Payment

// Order
router.post('/create-order', CreateOrder)
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById)

export { router as CustomerRoute };
