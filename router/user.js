const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { userResponse } = require("../select");

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = req.query.page;
    const [users, userCount] = await Promise.all([
      prisma.user.findMany({
        take: 12,
        skip: 12 * (page - 1),
        orderBy: {
          user_id: "desc",
        },
        select: userResponse,
      }),
      prisma.user.count(),
    ]);
    return res.status(200).json({ users, maxPage: Math.ceil(userCount / 12) });
    // return res.status(200).json({ page: req.query.page });
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: Number(req.params.id),
      },
      select: userResponse,
    });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
});

router.post("/", async (req, res) => {
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

router.patch("/:id", async (req, res) => {
  try {
    const user = await prisma.user.upsert({
      where: {
        user_id: Number(req.params.id),
      },
      update: {
        ...req.body,
      },
      create: {
        ...req.body,
      },
      select: userResponse,
    });
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error!" });
  }
});

router.delete("/", async (req, res) => {
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

module.exports = router;
