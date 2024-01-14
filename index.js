const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const dbconnection = require("./dbconfig");
const handleError =require("./utils/handleerror");
const morgan = require("morgan");
const cors = require("cors");
const router= require("./router/route");
const otprouter=require("./router/Passwordreset");
dotenv.config();

const PORT = process.env.PORT;

//API Security
//handle CORS error
app.use(cors());

//Logger
app.use(morgan("tiny"));

//set body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Rest API Endpoints
app.get("/", function (req, res) {
  res.send(
    "Hi World Welcome to my server🙏"
  );
});

//Rest API Endpoints with Routes
app.use("/api", router);
app.use("/api/otp",otprouter);
// app.use("/query", queryrouter);

//Error Handling in routes
app.use((req, res, next) => {
  const error = new Error("Resources not Found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

//Port beginner
app.listen(PORT, () => {
  dbconnection;
  console.log(`Server Started at ${PORT} 🎉`);
});