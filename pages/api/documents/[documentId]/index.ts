import { NextApiRequest, NextApiResponse } from "next";
import { requestHandler } from "@modules/Utils";
import nc from "next-connect";
import { localPrisma } from "@modules/Prisma";

const handler = nc(requestHandler);

handler
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;
    const result = await localPrisma.document.findFirst({
      where: {
        id: parseInt(<string>query.documentId),
      },
    });

    res.status(200).json(result);
  })
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;
    const body = req.body;
    delete body["id"];

    const result = await localPrisma.document.update({
      where: {
        id: parseInt(<string>query.documentId),
      },
      data: body,
    });

    res.status(200).json(result);
  });

export default handler;
