import { NextApiRequest, NextApiResponse } from "next";

/**
 * Wrap API call to handle Method Not Allowed (405) and Unprocessable Entity (422)
 * @param apiCall
 */
export const apiWrapper = (
  apiCall: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await apiCall(req, res);
    } catch (e) {
      res.status(422).send(e);
    } finally {
      if (!res.headersSent) res.status(405).send("Method Not Allowed");
    }
  };
};
