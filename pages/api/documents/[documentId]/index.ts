import { NextApiRequest, NextApiResponse } from "next";
import { AWS_S3, requestHandler } from "@modules/Utils";
import nc from "next-connect";
import { localPrisma } from "@modules/Prisma";

const handler = nc(requestHandler);

handler
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const file = await AWS_S3.getObject({
      Bucket: process.env.S3_BUCKET,
      Key: "sample-pdf-vylbwe.pdf",
    }).promise();

    const { query } = req;
    const result = await localPrisma.document.findFirst({
      where: {
        id: parseInt(<string>query.documentId),
      },
    });

    res.status(200).json({
      ...result,
      file: `data:application/pdf;base64,${file.Body.toString("base64")}`,
    });
  })
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;
    const body = req.body;
    delete body["id"];

    const result = await localPrisma.document.update({
      where: {
        id: parseInt(<string>query.documentId),
      },
      data: body,
    });

    res.status(200).json(result);
  });

export default handler;
