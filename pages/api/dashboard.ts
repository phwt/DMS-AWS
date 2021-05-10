import { PrismaClient } from "@prisma/client";
import { requestHandler } from "@modules/Utils";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const prisma = new PrismaClient();
const handler = nc(requestHandler);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  let result;

  const totalDocuments = async () => {
    const {
      count: { id },
    } = await prisma.document.aggregate({
      count: {
        id: true,
      },
    });

    return id;
  };
  const aggregateDocumentState = async (state) => {
    const {
      count: { id },
    } = await prisma.document.aggregate({
      count: {
        id: true,
      },
      where: {
        state,
      },
    });
    return id;
  };
  const latestDocuments = async () => {
    return await prisma.document.findMany({
      orderBy: {
        id: "desc",
      },
      take: 10,
    });
  };
  const latestDocumentsByState = async (state) => {
    return await prisma.document.findMany({
      where: {
        state,
      },
      orderBy: {
        id: "desc",
      },
      take: 10,
    });
  };

  const totalWorks = async () => {
    const {
      count: { id },
    } = await prisma.work.aggregate({
      count: {
        id: true,
      },
    });

    return id;
  };
  const aggregateWorkType = async (type) => {
    const {
      count: { id },
    } = await prisma.work.aggregate({
      count: {
        id: true,
      },
      where: {
        type,
      },
    });
    return id;
  };
  const latestWorks = async () => {
    return await prisma.work.findMany({
      orderBy: {
        id: "desc",
      },
      take: 10,
      include: {
        document: true,
      },
    });
  };

  switch (req.method) {
    case "GET":
      result = {
        summary: {
          document: {
            total: await totalDocuments(),
            inProgress: await aggregateDocumentState("IN_PROGRESS"),
            released: await aggregateDocumentState("RELEASED"),
            obsoleted: await aggregateDocumentState("OBSOLETE"),
          },
          work: {
            total: await totalWorks(),
            create: await aggregateWorkType("CREATE"),
            edit: await aggregateWorkType("EDIT"),
            cancel: await aggregateWorkType("CANCEL"),
          },
        },
        latestDocuments: {
          all: await latestDocuments(),
          inProgress: await latestDocumentsByState("IN_PROGRESS"),
          released: await latestDocumentsByState("RELEASED"),
        },
        latestWorks: {
          all: await latestWorks(),
        },
      };

      res.status(200).json(result);
      break;
  }
});

export default handler;
