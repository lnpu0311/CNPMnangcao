const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(bodyParser.json());
app.use(morgan("combined"));

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

//Router
const tenantRoute = require("./routes/tenant.route.js");
const hostRoute = require("./routes/host.route.js");
const hostelRoute = require("./routes/hostel.route.js");

//Api
app.use("/api/tenant", tenantRoute);
app.use("/api/hostel", hostelRoute);
app.use("/api/host", hostRoute);

app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
