const express = require("express");
const mongoose = require("mongoose");
const app = express();
const url = "mongodb+srv://krola:caca123@cluster0.wi94efx.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;
con.on("open", () => {
  console.log("Database connected, crud-restapi");
});

app.use(express.json());

const crudRouter = require("./routers/routes");
app.use("/api", crudRouter);

const userRouter = require("./routers/authcontroller");
app.use("/", userRouter);

app.listen(3000, () => {
  console.log("CRUD api rest connected on port 3000");
});
