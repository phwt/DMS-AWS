import { Col, Form, Row } from "react-bootstrap";
import React, { useCallback, useState } from "react";
import axios from "axios";

export const getServerSideProps = async () => {
  const { data } = await axios.get(`${process.env.API_PATH}documents/x/cancel`);

  return {
    props: { documents: data },
  };
};

const DocumentNew = ({ documents }) => {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");

  const submitRequest = useCallback(async () => {}, [name, detail]);

  return (
    <>
      <h2 className="pb-5">Document Cancel Form</h2>
      <Form as={Row} encType="multipart/form-data">
        <Col md={12}>
          <Form.Label>Document Name</Form.Label>
          <Form.Control
            as="select"
            custom
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          >
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
