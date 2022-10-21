import mongoose from "mongoose";
import { Mongo_URI } from "../config";

export default async () => {
  try {
    await mongoose.connect(Mongo_URI);
    console.log("Data base connected");
  } catch (error) {
    console.log(error);
  }
};
