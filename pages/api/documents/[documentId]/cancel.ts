import { requestHandler } from "@modules/Utils";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { localPrisma } from "@modules/Prisma";

const handler = nc(requestHandler);

handler
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await localPrisma.document.findMany({
      where: {
        state: "RELEASED",
      },
    });

    res.status(200).json(result);
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await localPrisma.work.create({
      data: {
        type: "CANCEL",
        detail: req.body.detail,
        documentId: parseInt(<string>req.query.documentId),
        create_by: req.body.create_by,
      },
    });

    res.status(200).json(result);
  });

export default handler;
