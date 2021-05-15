import { Col, Form, Row } from "react-bootstrap";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { restrictPage } from "@modules/Auth";
import { getSession } from "next-auth/client";

export const getServerSideProps = async (context) => {
  await restrictPage(context);
  const serverUser = await getSession(context);

  return { props: { serverUser } };
};

const DocumentNew = ({ serverUser }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("MANUAL");
  const [detail, setDetail] = useState("");
  const [file, setFile] = useState<File>();

  const router = useRouter();

  const submitRequest = useCallback(async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("type", type);
    formData.append("detail", detail);
    formData.append("create_by", serverUser.user.name);

    const { data } = await axios.post("/api/documents/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await router.push(`/works/${data.id}`);
  }, [name, type, detail, file]);

  return (
    <>
      <h2 className="pb-5">Document Creation Form</h2>
      <Form as={Row} encType="multipart/form-data">
        <Col md={6}>
          <Form.Label>Document Name</Form.Label>
          <Form.Control
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </Col>

        <Col md={6}>
          <Form.Label>Document Type</Form.Label>
          <Form.Control
            as="select"
            custom
            value={type}
            onChange={({ target: { value } }) => setType(value)}
          >
            <option value="MANUAL">Manual</option>
            <option value="PROCEDURE">Procedure</option>
            <option value="WORK_INSTRUCTION">Work Instruction</option>
            <option value="FORM">Form</option>
          </Form.Control>
        </Col>

        <Col md={12} className="mt-2">
          <Form.File
            label="Document File"
            className="d-inline"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFile(Array.from(e.target.files)[0]);
            }}
          />
        </Col>

        <Col md={12} className="mt-2">
          <Form.Label>Work Detail</Form.Label>
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
