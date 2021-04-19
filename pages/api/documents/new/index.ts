import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

// Multer 'files' object
declare module "next" {
  interface NextApiRequest {
    files: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      bucket: string;
      key: string;
      acl: string;
      contentType: string;
      // contentDisposition: null,
      storageClass: string;
      // serverSideEncryption: null,
      // metadata: null,
      location: string;
      etag: string;
      versionId: undefined;
    }[];
  }
}

const prisma = new PrismaClient();
const apiRoute = nextConnect({
  onError: (err) => {
    console.log(err.toString());
  },
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Upload Middleware
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    key: (req, file, cb) => cb(null, file.originalname),
  }),
});
const uploadMiddleware = upload.array("file");
apiRoute.use(uploadMiddleware);

// API Route
apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
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

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
