import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";

const prisma = new PrismaClient();
const apiRoute = nextConnect();

// Upload Middleware
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads", // TODO: Send to S3
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});
const uploadMiddleware = upload.array("file");
apiRoute.use(uploadMiddleware);

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  let result;

  const editDocument = await prisma.document.findFirst({
    where: {
      id: parseInt(<string>req.query.documentId),
    },
  });

  result = await prisma.work.create({
    data: {
      type: "EDIT",
      detail: req.body.detail,
      editDocumentId: parseInt(<string>req.query.documentId),
      document: {
        create: {
          name: editDocument.name,
          type: editDocument.type,
          state: "IN_PROGRESS",
          fileLocation: req.files[0].path,
        },
      },
    },
  });

  res.status(200).json(result);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
