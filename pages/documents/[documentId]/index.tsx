import { useRouter } from "next/router";
import axios from "axios";
import { DocumentStateBadge } from "../index";
import { restrictPage } from "@modules/Auth";
import { Badge } from "react-bootstrap";
import ActionCard from "@components/common/ActionCard";
import { useMemo } from "react";

export const getServerSideProps = async (context) => {
  await restrictPage(context);

  const { data } = await axios.get(
    `${process.env.API_PATH}documents/${context.params.documentId}`
  );

  return {
    props: { document: data },
  };
};

const Document = ({ document }) => {
  const router = useRouter();
  const { documentId } = router.query;

  const mailToContent = useMemo(() => {
    return `mailto:?body=${window.location}&subject=${document.name}`;
  }, []);

  return (
    <>
      <div>
        <h2 className="pb-5">Document Detail</h2>
        <div className="row mb-5">
          <div className="col-6 pl-0">
            <h3 className="ml-2"> {document.name} </h3>
            <table className="table table-borderless text-light">
              <tbody>
                <tr>
                  <th scope="row">Type</th>
                  <td> {document.type} </td>
                </tr>
                <tr>
                  <th scope="row">State</th>
                  <td>
                    <DocumentStateBadge state={document.state} />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-danger">
                    <Badge variant="danger" className="mr-2">
                      Warning
                    </Badge>
                    This document and the information in it is confidential and
                    may not be disclosed to any third party or used for any
                    other purpose without the express written permission of the
                    disclosing party
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-3">
            {document.state === "RELEASED" && (
              <ActionCard header="Create Request">
                <button
                  className="btn btn-block btn-warning"
                  onClick={async () => {
                    await router.push(`${documentId}/edit`);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-block btn-danger"
                  onClick={async () => {
                    await router.push(`${documentId}/cancel`);
                  }}
                >
                  Cancel
                </button>
              </ActionCard>
            )}
          </div>

          <div className="col-3">
            <ActionCard header="Actions">
              {!document.confidential && (
                <a
                  download={document.fileLocation}
                  href={document.file}
                  className="btn btn-block btn-info"
                >
                  <i className="fa fa-download mr-2" /> Download
                </a>
              )}
              <a href={mailToContent} className="btn btn-block btn-secondary">
                <i className="fa fa-paper-plane mr-2" />
                Send
              </a>
            </ActionCard>
          </div>
        </div>

        <iframe src={document.file} width="100%" height="500px" />
      </div>
      <br />
      <br />
    </>
  );
};

export default Document;
