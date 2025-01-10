import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from "express";
import { gameType, userType } from "./schema";
import cors from 'cors';
const app = express();
const port = 3000;
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors())
app.post("/createGame", async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Request body is undefined");
    }
    const x: any = req.body;
    const game = await prisma.game.create({
      data: {
        white:{connect:{id:x.whiteId}},
        black:{connect:{id:x.blackId}},
      },
    });
    console.log(game);
    res.status(200).json(game);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error in body");
  }
});



app.post("/createAccount", async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Request body is undefined");
    }
    const { name, address } = req.body;
    console.log(name, address);
    const user = await createAccountDb({ name, address });
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error in body");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
async function createAccountDb(x: any) {
  let user = await prisma.user.findFirst({
    where: {
      address: x.address,
    },
  });
  if (user) {
    console.log("userExists");
  } else {
    user = await prisma.user.create({
      data: {
        name: x.name,
        address: x.address,
      },
    });
  }

  return user;
}
