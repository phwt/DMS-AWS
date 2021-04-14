import { PrismaClient } from "@prisma/client";
import { apiWrapper } from "@modules/Utils";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default apiWrapper(async (req: NextApiRequest, res: NextApiResponse) => {
  let result;

  switch (req.method) {
    case "GET":
      result = await prisma.document.findMany({
        where: {
          state: "RELEASED",
        },
      });

      res.status(200).json(result);
      break;

    case "POST":
      result = await prisma.work.create({
        data: {
          type: "CANCEL",
          detail: req.body.detail,
          documentId: parseInt(<string>req.query.documentId),
        },
      });

      res.status(200).json(result);
      break;
  }
});
