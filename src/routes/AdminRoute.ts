import express, { Request, Response, NextFunction } from "express";
import {
  CreateVandor,
  GetDeliveryUSers,
  GetTransactions,
  GetTransactionsById,
  GetVandorByID,
  GetVandors,
  VerifyDeliveryUSer,
} from "../controllers";

const router = express.Router();

router.post("/vandor", CreateVandor);
router.get("/vandors", GetVandors);
router.get("/vandor/:id", GetVandorByID);
router.get("/transactions", GetTransactions);
router.get("/transaction/:id", GetTransactionsById);
router.put("/delivery/verify", VerifyDeliveryUSer);
router.get("/delivery/users", GetDeliveryUSers);

export { router as AdminRoute };
