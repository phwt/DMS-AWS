import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

/**
 * Request handler for use with next-connect
 */
export const requestHandler = {
  onError: (err, req: NextApiRequest, res: NextApiResponse) => {
    res.status(500).end(err.toString());
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).send("Method Not Allowed");
  },
};

/**
 * Append pseudo-random string to file name to make it more unique
 * @param fileName
 */
export const uniqueFileName = (fileName: string) => {
  return `${path.parse(fileName).name}-${Math.random()
    .toString(36)
    .substring(7)}${path.parse(fileName).ext}`;
};

export const AWS_S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const S3Middleware = () => {
  const upload = multer({
    storage: multerS3({
      s3: AWS_S3,
      bucket: process.env.S3_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      contentDisposition: "inline",
      key: (req, file, cb) => cb(null, uniqueFileName(file.originalname)),
    }),
  });

  return upload.array("file");
};

export const S3URLtoFileName = (url: string) => {
  const urls = url.split("/");
  return urls[urls.length - 1];
};

export const sortById = (array: any[]) => {
  array.sort((a, b) => (a.id < b.id ? 1 : -1));
};
