import express, { Request, Response, NextFunction } from "express";
import {
  DeliveryUserLogin,
  DeliveryUserSignup,
  EditDeliveryUserProfile,
  GetDeliveryUserProfile,
  UpdateDeliveryUserStatus,
} from "../controllers";
import { Aunthenticate } from "../middlewares";

const router = express.Router();

// Signup/ Create Customer
router.post("/signup", DeliveryUserSignup);
// Login
router.post("/login", DeliveryUserLogin);

//  Below all are Authenticated Routes
router.use(Aunthenticate);

// Change Service Stauts

router.put("/change-status", UpdateDeliveryUserStatus);

// Profile
router.get("/profile", GetDeliveryUserProfile);
router.patch("/profile", EditDeliveryUserProfile);

export { router as DeliveryRoute };
