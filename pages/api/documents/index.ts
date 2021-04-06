import { PrismaClient } from "@prisma/client";
import { apiWrapper } from "@modules/Utils";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default apiWrapper(async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const body = req.body;
  let result;

  switch (req.method) {
    case "GET":
      result = await prisma.document.findMany();

      res.status(200).json(result);
      break;

    case "POST":
      delete body["id"];
      result = await prisma.document.create({
        data: body,
      });

      res.status(200).json(result);
      break;
  }
});
