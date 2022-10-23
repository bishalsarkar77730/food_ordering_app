import express, { Request, Response, NextFunction } from "express";
import { CreateVandor, GetTransactions, GetTransactionsById, GetVandorByID, GetVandors } from "../controllers";

const router = express.Router();

router.post("/vandor", CreateVandor);
router.get("/vandors", GetVandors);
router.get("/vandor/:id", GetVandorByID);
router.get("/transactions", GetTransactions);
router.get("/transaction/:id", GetTransactionsById);

export { router as AdminRoute };
