const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const RootSchema = require("./graphql/schema");
const RootResolver = require("./graphql/resolvers");

const app = express();
app.use(bodyParser.json());

const a = "2020-07-03T07:22:42.041Z";

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
