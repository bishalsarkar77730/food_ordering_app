import express, { Request, Response, NextFunction } from "express";
import {
  GetFoodAvailability,
  GetFoodIn30Min,
  GetOffersbyPin,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
} from "../controllers";

const router = express.Router();

/**------------------ Food Availability ------------------**/
router.get("/:pincode", GetFoodAvailability);
/**------------------ Top Restaurants ------------------**/
router.get("/top-restaurants/:pincode", GetTopRestaurants);
/**------------------ Food Available in 30 Minutes ------------------**/
router.get("/foods-in-30-min/:pincode", GetFoodIn30Min);
/**------------------ Search Foods ------------------**/
router.get("/search/:pincode", SearchFoods);
/**------------------ Find Offers ------------------**/
router.get("/offers/:pincode", GetOffersbyPin);
/**------------------ Find Resturant By ID ------------------**/
router.get("/restaurant/:id", RestaurantById);

export { router as ShoppingRoute };
