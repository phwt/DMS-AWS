import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

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
