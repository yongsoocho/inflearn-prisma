const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { userResponse } = require("../select");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page);
    const posts = await prisma.post.findMany({
      take: 12,
      skip: 12 * (page - 1),
      orderBy: {
        post_id: "desc",
      },
      // include: {
      //   author: {
      //     select: {
      //       user_id: true,
      //       nickname: true,
      //     },
      //   },
      // },
      select: {
        post_id: true,
        content: true,
        thumbnail: true,
        created_at: true,
        author: {
          select: {
            user_id: true,
            nickname: true,
          },
        },
      },
    });
    return res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error!" });
  }
});

router.post("/", async (req, res) => {
  const newPost = await prisma.post.create({
    data: {
      content: faker.lorem.paragraph().slice(0, 255),
      thumbnail: faker.image.imageUrl(),
      author: {
        connect: {
          nickname: req.body.nickname,
        },
      },
    },
  });
  return res.status(201).json({ newPost });
});

router.post("/like", async (req, res) => {
  try {
    const newLike = await prisma.like.create({
      data: {
        author_id: Number(req.body.user_id),
        post_id: Number(req.body.post_id),
      },
    });
    return res.status(201).json({ newLike });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error!" });
  }
});

router.get("/like/:id", async (req, res) => {
  try {
    const likedPosts = await prisma.like.findMany({
      where: {
        author_id: Number(req.params.id),
      },
      select: {
        post: {
          include: {
            author: true,
          },
        },
        author: {
          select: {
            user_id: true,
            nickname: true,
            email: true,
          },
        },
      },
    });
    return res.status(201).json({ likedPosts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error!" });
  }
});

module.exports = router;
