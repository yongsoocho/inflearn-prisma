const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { userResponse } = require("../select");

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const tags = await prisma.tag.findMany({
    take: 100,
    orderBy: {
      tag_id: "desc",
    },
  });
  return res.status(200).json({ tags });
});

router.get("/agr", async (req, res) => {
  const arg = await prisma.tag.aggregate({
    _count: true,
    _avg: {
      posts: true,
    },
    _sum: {
      posts: true,
    },
    _min: {
      posts: true,
    },
    _max: {
      posts: true,
    },
  });
  return res.status(200).json({ arg });
});

router.get("/dis", async (req, res) => {
  const tags = await prisma.tag.findMany({
    orderBy: {
      tag_id: "desc",
    },
    distinct: ["content"],
  });
  return res.status(200).json({ tags });
});

router.get("/grb", async (req, res) => {
  const tags = await prisma.tag.groupBy({
    by: ["content"],
    _count: {
      _all: true,
    },
    _sum: {
      posts: true,
    },
    _avg: {
      posts: true,
    },
    _min: {
      posts: true,
    },
    _max: {
      posts: true,
    },
    having: {
      posts: {
        _avg: {
          gt: 55,
        },
      },
    },
  });
  return res.status(200).json({ tags });
});

module.exports = router;
