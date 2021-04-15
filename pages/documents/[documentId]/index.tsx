import { useRouter } from "next/router";
import axios from "axios";
import { DocumentStateBadge } from "../index";

export const getServerSideProps = async (context) => {
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

  return (
    <>
      <div>
        <h2 className="pb-5">Document Detail</h2>
        <h3> {document.name} </h3>
        <div className="col-6 pl-0">
          <table className="table table-borderless text-light">
            <tbody>
              <tr>
                <th scope="row">Type</th>
                <td> {document.type} </td>
              </tr>
              <tr>
                <th scope="row">State</th>
                <td>
                  {" "}
                  <DocumentStateBadge state={document.state} />{" "}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <iframe
          src="/content/{{ document.file_location }}"
          width="100%"
          height="500px"
        />
      </div>
      <br />
      <br />
    </>
  );
};

export default Document;
