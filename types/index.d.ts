import { NextApiRequest } from "next";

declare module "next" {
  export interface NextApiRequest {
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
