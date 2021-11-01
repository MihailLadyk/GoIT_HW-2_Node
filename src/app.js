const express = require("express");
const path = require("path");
const volleyball = require("volleyball");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const users = require("./routes/users");

const app = express();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => {
    console.log(error);
    procces.exit(1);
  });

app.use(
  cors({
    origin: "*",
  })
);
app.use(volleyball);
// app.use(express.static(path.join(__dirname + "../public")));
app.use(express.json());

app.use("/api/users", users);

module.exports = app;
