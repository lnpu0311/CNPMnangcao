const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();

//Kết nối với database
const mongoose = require("mongoose");
mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => {
    console.log("Connect successfully!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  })
  .catch((err) => {
    console.log("Failed connection" + err.message);
  });

app.get("/", (req, res) => {
  res.send("Hello Pukachu!");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
