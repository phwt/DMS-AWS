import { NextApiRequest, NextApiResponse } from "next";

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
