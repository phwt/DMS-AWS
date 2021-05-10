import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { requestHandler, S3Middleware } from "@modules/Utils";

const prisma = new PrismaClient();
const handler = nc(requestHandler);

handler.use(S3Middleware());

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await prisma.work.create({
    data: {
      detail: req.body.detail,
      document: {
        create: {
          name: req.body.name,
          type: req.body.type,
          fileLocation: req.files[0].location,
        },
      },
    },
  });

  res.status(200).json(result);
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
