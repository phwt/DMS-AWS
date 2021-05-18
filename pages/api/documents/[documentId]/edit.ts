import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { requestHandler, S3Middleware, S3URLtoFileName } from "@modules/Utils";
import { localPrisma } from "@modules/Prisma";

const handler = nc(requestHandler);

handler.use(S3Middleware());

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const editDocument = await localPrisma.document.findFirst({
    where: {
      id: parseInt(<string>req.query.documentId),
    },
  });

  const result = await localPrisma.work.create({
    data: {
      type: "EDIT",
      detail: req.body.detail,
      editDocumentId: parseInt(<string>req.query.documentId),
      create_by: req.body.create_by,
      document: {
        create: {
          name: req.body.name,
          type: editDocument.type,
          state: "IN_PROGRESS",
          fileLocation: S3URLtoFileName(req.files[0].location),
          departmentId: editDocument.departmentId,
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
