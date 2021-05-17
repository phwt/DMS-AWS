import { requestHandler } from "@modules/Utils";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { localPrisma } from "@modules/Prisma";

const handler = nc(requestHandler);

handler
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await localPrisma.document.findMany({
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    res.status(200).json(result);
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body;

    delete body["id"];
    const result = await localPrisma.document.create({
      data: body,
    });

    res.status(200).json(result);
  });

export default handler;
