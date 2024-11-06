const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const morgan = require("morgan");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://cnpm-nangcao.vercel.app", // replace with your actual Vercel app URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))
      ) {
        return callback(null, true);
      }
      const msg =
        "The CORS policy for this site does not allow access from the specified origin.";
      return callback(new Error(msg), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// Kết nối với database
const connectDB = require("./configs/db.js");
connectDB();

// Router
const hostelRoute = require("./routes/hostel.route.js");
const roomRoute = require("./routes/room.route.js");
const userRoute = require("./routes/user.route.js");
const authRoutes = require("./routes/auth.route");
const landlordRoute = require("./routes/landlord.route");

// Api
app.use("/api/room", roomRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoutes);
app.use("/api/landlord", landlordRoute);
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
