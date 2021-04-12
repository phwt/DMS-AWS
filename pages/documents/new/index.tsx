import { Col, Form, Row } from "react-bootstrap";

const DocumentNew = () => {
  return (
    <>
      <h2 className="pb-5">Document Creation Form</h2>
      <Form as={Row} encType="multipart/form-data">
        <Col md={6}>
          <Form.Label>Document Name</Form.Label>
          <Form.Control />
        </Col>

        <Col md={6}>
          <Form.Label>Document Type</Form.Label>
          <Form.Control as="select" custom>
            <option value="MANUAL">Manual</option>
            <option value="PROCEDURE">Procedure</option>
            <option value="WORK_INSTRUCTION">Work Instruction</option>
            <option value="FORM">Form</option>
          </Form.Control>
        </Col>

        <Col md={12} className="mt-2">
          <Form.Label>Document File</Form.Label>
          <div className="custom-file">
            <input type="file" className="custom-file-input" />
            <label className="custom-file-label" htmlFor="customFile">
              Choose file
            </label>
          </div>
        </Col>

        <Col md={12} className="mt-2">
          <Form.Label>Work Detail</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Col>

        <Col md={12}>
          <input type="submit" className="btn btn-info mt-3" value="Submit" />
        </Col>
      </Form>
    </>
  );
};

export default DocumentNew;
