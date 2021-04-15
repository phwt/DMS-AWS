import { useRouter } from "next/router";
import axios from "axios";

export const getServerSideProps = async (context) => {
  const { data } = await axios.get(
    `${process.env.API_PATH}works/${context.params.workId}`
  );

  return {
    props: { work: data },
  };
};

const Work = ({ work }) => {
  const router = useRouter();
  const { workId } = router.query;

  return (
    <div>
      <div className="row">
        <div className="col-3">
          <h2 className="pb-5">Work Detail</h2>
        </div>
        <div className="col-9 text-right">
          <div className="mt-2">{work.state}</div>
        </div>
      </div>

      <h3>work</h3>
      <p className="text-muted">
        <small>{work.create_date}</small>
      </p>
      <div className="row">
        <div className="col-6">
          <div className="pl-0">
            <table className="table table-borderless text-light">
              <tbody>
                <tr>
                  <th scope="row">Detail</th>
                  <td>{work.detail}</td>
                </tr>
                <tr>
                  <th scope="row">Type</th>
                  <td>{work.type}</td>
                </tr>
                <tr>
                  <th scope="row">State</th>
                  <td>{work.state}</td>
                </tr>
                <tr>
                  <th scope="row">Complete Date</th>
                  <td>{work.complete_date ?? <i>Not Completed</i>}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-1" />
        <div className="col-4">
          <div className="row">
            <div className="card bg-dark w-100">
              <div className="card-header">
                <h5>Related Document</h5>
              </div>
              <div className="card-body">
                <div className="card-text">
                  <b>Name</b>: {work.document.name} <br />
                  <b>Type</b>: {work.document.type} <br />
                  <a className="btn btn-info mt-3">View Document</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-3 p-0">
        <div className="card bg-dark mt-3">
          <div className="card-header">
            <h5>Review Action</h5>
          </div>
          <div className="card-body">
            <button className="btn btn-block btn-success">Approve</button>
            <button className="btn btn-block btn-danger">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
