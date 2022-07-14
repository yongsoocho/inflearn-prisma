const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const { userResponse } = require("./select");
const { faker } = require("@faker-js/faker");
const userRouter = require("./router/user");
const postRouter = require("./router/post");
const tagRouter = require("./router/tag");

const prisma = new PrismaClient();

app.use(express.urlencoded({ extended: true }));
app.use("/tag", tagRouter);
app.use("/post", postRouter);
app.use("/", userRouter);

app.listen(3000, () => {
  console.log("server on 3000");
});

module.exports = { prisma };
