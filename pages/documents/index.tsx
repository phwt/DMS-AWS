import axios from "axios";
import { Form } from "react-bootstrap";
import { useRouter } from "next/router";
import { restrictPage } from "@modules/Auth";
import React, { useState } from "react";

export const getServerSideProps = async (context) => {
  await restrictPage(context);

  const { data } = await axios.get(`${process.env.API_PATH}documents/`);
  data.sort((a, b) => (a.id < b.id) ? 1 : -1)
  return {
    props: {
      documents: data,
    },
  };
};

export const DocumentStateBadge = ({ state }) => {
  switch (state) {
    case "IN_PROGRESS":
      return <span className="badge badge-pill badge-info">In-Progress</span>;
    case "RELEASED":
      return <span className="badge badge-pill badge-success">Released</span>;
    case "OBSOLETE":
      return <span className="badge badge-pill badge-danger">Obsolete</span>;
    case "RECALLED":
      return <span className="badge badge-pill badge-warning">Recalled</span>;
  }
};

export const documentTypeText = (type) => {
  switch (type) {
    case "MANUAL":
      return "Manual";
    case "PROCEDURE":
      return "Procedure";
    case "WORK_INSTRUCTION":
      return "Work Instruction";
    case "FORM":
      return "Form";
  }
};

const DocumentList = ({ documents }) => {
  const router = useRouter();
  const documentType = ["-", "MANUAL", "PROCEDURE", "WORK_INSTRUCTION", "FORM"];
  const documentState = [
    "-",
    "IN_PROGRESS",
    "RELEASED",
    "OBSOLETE",
    "RECALLED",
  ];
  const [typeSelect, setTypeSelect] = useState("-");
  const [stateSelect, setStateSelect] = useState("-");

  return (
    <>
      {/* {% block title %}{{ doc_type|title }} Document List{% endblock %} */}
      <div className="row no-gutters">
        <div className="col-6">
          <h2 className="pb-5">View Documents</h2>
        </div>
        <div className="col-6 text-right">
          Request to&nbsp;&nbsp;&nbsp;
          <a
            className="btn btn-sm btn-success"
            onClick={async () => {
              await router.push("/documents/new");
            }}
          >
            <i className="fa fa-plus" />
            &nbsp;&nbsp;Create
          </a>
          &nbsp;
          <a
            className="btn btn-sm btn-info"
            onClick={async () => {
              await router.push("/documents/x/edit");
            }}
          >
            <i className="fa fa-pencil-alt" />
            &nbsp;&nbsp;Edit
          </a>
          &nbsp;
          <a
            className="btn btn-sm btn-danger"
            onClick={async () => {
              await router.push("/documents/x/cancel");
            }}
          >
            <i className="fa fa-minus" />
            &nbsp;&nbsp;Cancel
          </a>
        </div>
      </div>

      <div className="table-responsive table-mh">
        <table className="table table-borderless text-light">
          <thead className="bg-0">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">State</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td />
              <td>
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => setTypeSelect(e.target.value.toUpperCase())}
                >
                  {documentType.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </Form.Control>
              </td>
              <td>
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => setStateSelect(e.target.value.toUpperCase())}
                >
                  {documentState.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </Form.Control>
              </td>
              <td />
            </tr>

            {documents
              .filter((d) => d.type === typeSelect || typeSelect === "-")
              .filter((d) => d.state === stateSelect || stateSelect === "-")
              .map((document) => (
                <tr key={document.id}>
                  <td>
                    {document.name}
                    {document.confidential && (
                      <i className="ml-2 fa fa-lock text-danger" />
                    )}
                  </td>
                  <td>{documentTypeText(document.type)}</td>
                  <td>
                    <DocumentStateBadge state={document.state} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-block"
                      onClick={async () => {
                        await router.push(`/documents/${document.id}`);
                      }}
                    >
                      <i
                        className="fa fa-chevron-right text-info"
                        aria-hidden="true"
                      />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DocumentList;
