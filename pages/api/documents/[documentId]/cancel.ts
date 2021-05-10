import { PrismaClient } from "@prisma/client";
import { requestHandler } from "@modules/Utils";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const prisma = new PrismaClient();
const handler = nc(requestHandler);

handler
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await prisma.document.findMany({
      where: {
        state: "RELEASED",
      },
    });

    res.status(200).json(result);
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await prisma.work.create({
      data: {
        type: "CANCEL",
        detail: req.body.detail,
        documentId: parseInt(<string>req.query.documentId),
      },
    });

    res.status(200).json(result);
  });

export default handler;
