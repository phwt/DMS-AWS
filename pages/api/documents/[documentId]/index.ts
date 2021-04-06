import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { apiWrapper } from "../../../../modules/Utils";

const prisma = new PrismaClient();

export default apiWrapper(async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const body = req.body;
  let result;

  switch (req.method) {
    case "GET":
      result = await prisma.document.findFirst({
        where: {
          id: parseInt(<string>query.documentId),
        },
      });

      res.status(200).json(result);
      break;
    case "PATCH":
      delete body["id"];

      result = await prisma.document.update({
        where: {
          id: parseInt(<string>query.documentId),
        },
        data: body,
      });

      res.status(200).json(result);
      break;
  }
});
