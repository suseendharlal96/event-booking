const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const RootSchema = require("./graphql/schema");
const RootResolver = require("./graphql/resolvers");
const isAuth = require("./middleware/auth");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// will check each req wheather authenticated or not
app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: RootSchema,
    rootValue: RootResolver,
    graphiql: true,
  })
);

mongoose
  .connect(
    "mongodb+srv://suseendhar:susee123@cluster0-iwva7.mongodb.net/graphqlreact?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("server running at 4000");
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
