//--------------------------- imports ------------------------------//

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

require("./models/user.model");
const requireToken = require("./middleware/requireToken");
const authRouter = require("./routes/authRoutes");
//----------------------------------- Contants ---------------------------------//

const mongoUrl = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

//------------------------------------ Server Config ------------------------------------//

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----------------------------------- Router config --------------------------------- //

app.use(authRouter);

//-------------------------------------DB Config ------------------------------------------//

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("connected", () => console.log("Connected to mongoDb atlas"));
db.on("error", (err) => console.log("Failed to connect to mongoDb atlas", err));
db.on("disconnected", () => console.log("MongoDB event disconnected"));
process.on("SIGINT", () => {
  db.close(() => {
    console.log(
      "Mongoose connection is disconnected due to application termination"
    );
    process.exit(0);
  });
});

// --------------------------- Test Routers --------------------------------------//

app.get("/", requireToken, (req, res) => {
  res.send(`email is ${req.user.email}`);
});

//-------------------------------------------- Listen -------------------------------------------//

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
