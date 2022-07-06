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
inputUsers();
