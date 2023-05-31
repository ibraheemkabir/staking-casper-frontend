"use strict";

import { NextFunction, Request, Response } from "express";

var express = require("express");
var cors = require("cors");

let options = {};

let app = module.exports = express();

app.use(express.static(__dirname + "/public")); // set the static files location /public/img will be /img for users
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());
app.on("start", function () {});

export default app;
     