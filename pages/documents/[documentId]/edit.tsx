import { Col, Form, Row } from "react-bootstrap";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { restrictPage } from "@modules/Auth";
import { getSession } from "next-auth/client";
import Head from "next/head";

export const getServerSideProps = async (context) => {
  await restrictPage(context);

  const { data } = await axios.get(`${process.env.API_PATH}documents/x/cancel`);
  const serverUser = await getSession(context);

  return {
    props: { documents: data, serverUser },
  };
};

const DocumentNew = ({ documents, serverUser }) => {
  const router = useRouter();
  const { documentId: routerDocumentId } = router.query;

  const [documentId, setDocumentId] = useState(0);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [file, setFile] = useState<File>();

  useEffect(() => {
    if (routerDocumentId !== "x")
      setDocumentId(parseInt(routerDocumentId as string));
  }, []);

  const submitRequest = useCallback(async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("detail", detail);
    formData.append("name", name);
    formData.append("create_by", serverUser.user.name);

    const { data } = await axios.post(
      `${process.env.API_PATH}documents/${documentId}/edit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    await router.push(`/works/${data.id}`);
  }, [documentId, detail, file]);

  return (
    <>
      <Head>
        <title>Document Edit Request</title>
      </Head>

      <h2 className="pb-5">Document Edit Form</h2>
      <Form as={Row} encType="multipart/form-data">
        <Col md={12}>
          <Form.Label>Document Name</Form.Label>
          <Form.Control
            as="select"
            custom
            value={documentId}
            onChange={({ target: { value } }) =>
              setDocumentId(parseInt(value as string))
            }
          >
            <option value={0}>Select Document</option>
            {documents.map((document) => (
              <option key={document.id} value={document.id}>
                {document.name} | {document.type}
              </option>
            ))}
          </Form.Control>
        </Col>

        <Col md={12} className="mt-2">
          <Form.Label>New Document Name</Form.Label>
          <Form.Control
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </Col>

        <Col md={12} className="mt-2">
          <Form.File
            label="Document File"
            accept=".pdf"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFile(Array.from(e.target.files)[0]);
            }}
          />
        </Col>

        <Col md={12} className="mt-2">
          <Form.Label>Work Detail (Edit Reason)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={detail}
            onChange={({ target: { value } }) => setDetail(value)}
          />
        </Col>

        <Col md={12}>
          <input
            type="button"
            className="btn btn-info mt-3"
            value="Submit"
            onClick={submitRequest}
          />
        </Col>
      </Form>
    </>
  );
};

export default DocumentNew;
