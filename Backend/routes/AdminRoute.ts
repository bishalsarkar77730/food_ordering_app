import express, { Request, Response, NextFunction } from "express";
import { CreateVandor, GetVandorByID, GetVandors } from "../controllers";

const router = express.Router();

router.post("/vandor", CreateVandor);
router.get("/vandors", GetVandors);
router.get("/vandor/:id", GetVandorByID);

export { router as AdminRoute };
