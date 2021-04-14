import { Col, Form, Row } from "react-bootstrap";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export const getServerSideProps = async () => {
  const { data } = await axios.get(`${process.env.API_PATH}documents/x/cancel`);

  return {
    props: { documents: data },
  };
};

const DocumentNew = ({ documents }) => {
  const router = useRouter();
  const { documentId: routerDocumentId } = router.query; // TODO: Pre-populate select

  const [documentId, setDocumentId] = useState(0);
  const [detail, setDetail] = useState("");

  const submitRequest = useCallback(async () => {
    console.log(`${process.env.API_PATH}documents/${documentId}/cancel`);
    await axios.post(`${process.env.API_PATH}documents/${documentId}/cancel`, {
      detail,
    });
  }, [documentId, detail]);

  return (
    <>
      <h2 className="pb-5">Document Cancel Form</h2>
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
          <Form.Label>Work Detail (Cancellation Reason)</Form.Label>
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
