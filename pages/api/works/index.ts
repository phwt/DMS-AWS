import { PrismaClient } from "@prisma/client";
import { requestHandler } from "@modules/Utils";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const prisma = new PrismaClient();
const handler = nc(requestHandler);

handler
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await prisma.work.findMany({
      include: {
        document: true,
      },
    });

    res.status(200).json(result);
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body;
    delete body["id"];
    const result = await prisma.work.create({
      data: body,
    });

    res.status(200).json(result);
  });

export default handler;
