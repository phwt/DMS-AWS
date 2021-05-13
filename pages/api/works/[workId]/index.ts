import { NextApiRequest, NextApiResponse } from "next";
import { requestHandler } from "@modules/Utils";
import nc from "next-connect";
import { localPrisma } from "@modules/Prisma";

const handler = nc(requestHandler);

handler
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;

    const result = await localPrisma.work.findFirst({
      where: {
        id: parseInt(<string>query.workId),
      },
      include: {
        document: true,
      },
    });

    res.status(200).json(result);
  })
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body;
    const { query } = req;
    delete body["id"];

    const result = await localPrisma.work.update({
      where: {
        id: parseInt(<string>query.workId),
      },
      data: body,
    });

    res.status(200).json(result);
  });

export default handler;
