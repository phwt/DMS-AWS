import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { requestHandler, S3Middleware } from "@modules/Utils";

const prisma = new PrismaClient();
const handler = nc(requestHandler);

handler.use(S3Middleware());

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const editDocument = await prisma.document.findFirst({
    where: {
      id: parseInt(<string>req.query.documentId),
    },
  });

  const result = await prisma.work.create({
    data: {
      type: "EDIT",
      detail: req.body.detail,
      editDocumentId: parseInt(<string>req.query.documentId),
      document: {
        create: {
          name: req.body.name,
          type: editDocument.type,
          state: "IN_PROGRESS",
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
