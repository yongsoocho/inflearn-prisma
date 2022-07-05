const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
});

app.post("/", async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
        provider: req.body.provider,
        agree:
          req.body.agree === "false" || req.body.agree === "0" ? false : true,
      },
    });
    return res.status(201).json({ newUser });
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
});

app.delete("/", async (req, res) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        user_id: Number(req.body.user_id),
      },
    });
    return res.status(200).json({ deletedUser });
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
});

app.listen(3000, () => {
  console.log("server on 3000");
});
