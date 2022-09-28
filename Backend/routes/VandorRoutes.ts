import express, { Request, Response, NextFunction } from "express";
import {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  Vandorlogin,
} from "../controllers";
import { Aunthenticate } from "../middlewares";

const router = express.Router();

router.post("/login", Vandorlogin);

router.use(Aunthenticate)
router.get("/profile", GetVandorProfile);
router.patch("/profile", UpdateVandorProfile);
router.patch("/service", UpdateVandorService);

// router.get('/', (req: Request, res: Response, next: NextFunction) =>{
//     res.json({message: "hello from Vandor"})
// })

export { router as VandorRoute };
