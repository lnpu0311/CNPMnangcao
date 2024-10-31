const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const allowedOrigins = ["http://localhost:3000"]; // Thêm các URL frontend bạn muốn cho phép

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("combined"));

//Kết nối với database
const connectDB = require("./configs/db.js");
connectDB();

//Router
const hostelRoute = require("./routes/hostel.route.js");
const roomRoute = require("./routes/room.route.js");
const userRoute = require("./routes/user.route.js");
const authRoutes = require("./routes/auth.route");
const landlordRoute = require("./routes/landlord.route");
//Api
app.use("/api/hostel", hostelRoute);
app.use("/api/room", roomRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoutes);
app.use("/api/landlord", landlordRoute);

app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
