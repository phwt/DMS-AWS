import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { requestHandler, S3Middleware, S3URLtoFileName } from "@modules/Utils";
import { localPrisma } from "@modules/Prisma";

const handler = nc(requestHandler);

handler.use(S3Middleware());

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await localPrisma.work.create({
    data: {
      detail: req.body.detail,
      create_by: req.body.create_by,
      document: {
        create: {
          name: req.body.name,
          type: req.body.type,
          fileLocation: S3URLtoFileName(req.files[0].location),
          confidential: parseInt(req.body.confidential) === 1,
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
