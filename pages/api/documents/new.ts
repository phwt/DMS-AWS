import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";

// Multer 'files' object
declare module "next" {
    interface NextApiRequest {
        files: {
            fieldname: string;
            originalname: string;
            encoding: string;
            mimetype: string;
            destination: string;
            filename: string;
            path: string;
            size: number;
        }[];
    }
}

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

// API Route
apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await prisma.work.create({
        data: {
            detail: req.body.detail,
            document: {
                create: {
                    name: req.body.name,
                    type: req.body.type,
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
