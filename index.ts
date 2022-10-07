import express from "express";
import App from "./Backend/services/ExpressApp";
import dbConnection from "./Backend/services/Database";

const Startserver = async () => {
  const app =express()
  await dbConnection()
  await App(app);
  app.listen(8000, () => {
    console.log(
      `Server is started on http://localhost:${8000}`
    );
  })
}

Startserver();