import { useRouter } from "next/router";
import axios from "axios";
import { WorkTypeBadge } from "../index";
import { documentTypeText } from "../../documents";
import { useCallback, useMemo } from "react";

export const getServerSideProps = async (context) => {
  const { data } = await axios.get(
    `${process.env.API_PATH}works/${context.params.workId}`
  );

  return {
    props: { work: data },
  };
};

const WorkStateBadges = ({ state }) => {
  const badgeColor = () => {
    switch (state) {
      case "NEW":
        return {
          new: "badge-light",
          link1: "bg-dark",
          review: "badge-dark",
          link2: "bg-dark",
          completed: "badge-dark",
        };
      case "REVIEW":
        return {
          new: "badge-light",
          link1: "bg-light",
          review: "badge-light",
          link2: "bg-dark",
          completed: "badge-dark",
        };
      case "COMPLETED":
        return {
          new: "badge-success",
          link1: "bg-success",
          review: "badge-success",
          link2: "bg-success",
          completed: "badge-success",
        };
    }
  };

  return (
    <>
      <span className={`badge badge-pill ${badgeColor().new}`}>New</span>
      <span className={`progress-link ${badgeColor().link1}`} />
      <span className={`badge badge-pill ${badgeColor().review}`}>Review</span>
      <span className={`progress-link ${badgeColor().link2}`} />
      <span className={`badge badge-pill ${badgeColor().completed}`}>
        Completed
      </span>
    </>
  );
};

const Work = ({ work }) => {
  const router = useRouter();
  const { workId } = router.query;

  const workTitle = useMemo(() => {
    switch (work.type) {
      case "CREATE":
        return `Request to create ${work.document.name}`;
      case "EDIT":
        return `Request to edit ${work.document.name}`;
      case "CANCEL":
        return `Request to cancel ${work.document.name}`;
    }
  }, [work.type]);

  const updateWorkState = useCallback(
    async (state) => {
      await axios.patch(`${process.env.API_PATH}works/${workId}`, {
        state,
        complete_date: new Date(),
      });
      window.location.reload();
    },
    [work]
  );

  const submitReviewAction = useCallback(
    async (result) => {
      let nextState;
      switch (work.type) {
        case "CREATE":
          nextState = result ? "RELEASED" : "RECALLED";
          break;
        case "EDIT":
          break;
        case "CANCEL":
          nextState = result ? "OBSOLETE" : "RELEASED";
          break;
      }

      await axios.patch(`${process.env.API_PATH}documents/${work.documentId}`, {
        state: nextState,
      });
      await updateWorkState("COMPLETED");
    },
    [work]
  );

  return (
    <div>
      <div className="row">
        <div className="col-3">
          <h2 className="pb-5">Work Detail</h2>
        </div>
        <div className="col-9 text-right">
          <div className="mt-2">
            <WorkStateBadges state={work.state} />
          </div>
        </div>
      </div>

      <h3>{workTitle}</h3>
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
                  <td>
                    <WorkTypeBadge type={work.type} />
                  </td>
                </tr>
                <tr>
                  <th scope="row">State</th>
                  <td>{work.state[0] + work.state.slice(1).toLowerCase()}</td>
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
                  <b>Type</b>: {documentTypeText(work.document.type)} <br />
                  <a
                    className="btn btn-info mt-3"
                    onClick={async () => {
                      await router.push(`/documents/${work.document.id}`);
                    }}
                  >
                    View Document
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {work.state === "NEW" && (
        <div className="col-3 p-0">
          <div className="card bg-dark mt-3">
            <div className="card-header">
              <h5 className="m-0">Action</h5>
            </div>
            <div className="card-body">
              <button
                className="btn btn-block btn-info"
                onClick={async () => {
                  await updateWorkState("REVIEW");
                }}
              >
                Submit For Review
              </button>
            </div>
          </div>
        </div>
      )}

      {work.state === "REVIEW" && (
        <div className="col-3 p-0">
          <div className="card bg-dark mt-3">
            <div className="card-header">
              <h5 className="m-0">Review Actions</h5>
            </div>
            <div className="card-body">
              <button
                className="btn btn-block btn-success"
                onClick={async () => {
                  await submitReviewAction(true);
                }}
              >
                Approve
              </button>
              <button
                className="btn btn-block btn-danger"
                onClick={async () => {
                  await submitReviewAction(false);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;
