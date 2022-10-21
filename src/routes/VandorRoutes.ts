import express, { Request, Response, NextFunction } from "express";
import {
  AddFood,
  GetFood,
  GetVandorProfile,
  UpdateVandorCoverImage,
  UpdateVandorProfile,
  UpdateVandorService,
  Vandorlogin,
} from "../controllers";
import { Aunthenticate } from "../middlewares";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
    );
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", Vandorlogin);

router.use(Aunthenticate);
router.get("/profile", GetVandorProfile);
router.patch("/profile", UpdateVandorProfile);
router.patch("/service", UpdateVandorService);
router.patch("/coverimage", images, UpdateVandorCoverImage);
router.post("/food", images, AddFood);
router.get("/foods", GetFood);

export { router as VandorRoute };
