import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user";

const app = express();

// use body parser to parse json data from req body
app.use(bodyParser.json());

// user routes
app.use(userRoutes);

// if route not present
app.use((req, res) => {
  res.status(404).json({ message: "Route not found!" });
});

// start server
app.listen(8080, () => {
  console.log("app started");
});
