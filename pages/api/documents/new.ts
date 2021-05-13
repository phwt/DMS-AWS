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
      document: {
        create: {
          name: req.body.name,
          type: req.body.type,
          fileLocation: S3URLtoFileName(req.files[0].location),
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
