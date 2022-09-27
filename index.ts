import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

// Import All Routes
import { AdminRoute, VandorRoute } from "./Backend/routes";
import { Mongo_URI } from "./Backend/config";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(Mongo_URI)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log("error" + err));

// Use all the Routes
app.use("/admin", AdminRoute);
app.use("/vandor", VandorRoute);

app.listen(8000, () => {
  console.log(`server is running on http://localhost:${8000}`);
});
