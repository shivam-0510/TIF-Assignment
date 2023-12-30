const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authRouter = require("./Routes/auth.route");
const roleRouter = require("./Routes/role.route");
const communityRouter = require("./Routes/community.route");
const memberRouter = require("./Routes/member.route");

//connect mongoose to database
mongoose.connect("mongodb://127.0.0.1:27017/TIF");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

dotenv.config();

app.use(bodyParser.json());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//AUTH ROUTE
app.use("/v1/auth", authRouter);

//ROLE ROUTE
app.use("/v1/role", roleRouter);

//COMMUNITY ROUTE
app.use("/v1/community", communityRouter);

//MEMBER ROUTE
app.use("/v1/member", memberRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
