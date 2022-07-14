const { faker } = require("@faker-js/faker");
const { prisma } = require("./index");
const { v4 } = require("uuid");

async function inputUsers() {
  let i = 0;
  while (i < 10000) {
    const provider =
      Math.round(Math.random() * 3) > 2
        ? "LOCAL"
        : Math.round(Math.random() * 3) > 1
        ? "KAKAO"
        : "NAVER";
    const newUser = await prisma.user.create({
      data: {
        nickname: v4().slice(0, 12),
        email: faker.internet.email().slice(0, 30),
        provider,
        name: faker.name.findName().slice(0, 15),
      },
    });
    i++;
  }
}
// inputUsers();

async function inputPosts() {
  let i = 0;
  while (i < 100000) {
    const author_id =
      Math.round(Math.random() * 10014) >= 13
        ? Math.round(Math.random() * 10014)
        : 13;
    const user = await prisma.user.findUnique({
      where: {
        user_id: author_id,
      },
      select: {
        user_id: true,
      },
    });
    if (!user) {
      continue;
    }
    const newPost = await prisma.post.create({
      data: {
        content: faker.lorem.paragraphs().slice(0, 254),
        thumbnail: faker.image.imageUrl(),
        author_id,
      },
    });
    i++;
  }
}
// inputPosts();

const content = ["ootd", "맛집", "뷰", "한강", "행복", "맞팔"];
async function inputTags() {
  try {
    let i = 0;
    while (i < 1000) {
      // const newTag = await prisma.tag.create({
      //   data: {
      //     content: content[i % 6],
      //   },
      // });
      await prisma.tag.update({
        where: {
          tag_id: i + 1,
        },
        data: {
          posts: Math.round(Math.random() * 100),
        },
      });
      i++;
    }
  } catch (error) {
    console.log(error);
  }
}
inputTags();
