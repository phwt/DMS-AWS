import { useRouter } from "next/router";
import axios from "axios";
import WorkTypeBadge from "@components/WorkTypeBadge";
import { documentTypeText } from "../../documents";
import { useCallback, useMemo, useState } from "react";
import { restrictPage } from "@modules/Auth";
import ActionCard from "@components/common/ActionCard";
import { Row, Col } from "react-bootstrap";
import { getSession } from "next-auth/client";

export const getServerSideProps = async (context) => {
  await restrictPage(context);
  const serverUser = await getSession(context);
  const { data } = await axios.get(
    `${process.env.API_PATH}works/${context.params.workId}`
  );

  return {
    props: { work: data, serverUser },
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

const Work = ({ work, serverUser }) => {
  const router = useRouter();
  const { workId } = router.query;
  const [userGroup] = useState(serverUser.groups[0]);

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
      let data: any = { state };
      if (state === "COMPLETED") data = { ...data, complete_date: new Date() };
      await axios.patch(`${process.env.API_PATH}works/${workId}`, data);
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
          nextState = result ? "RELEASED" : "RECALLED";
          break;
        case "CANCEL":
          nextState = result ? "OBSOLETE" : "RELEASED";
          break;
      }

      await axios.patch(`${process.env.API_PATH}documents/${work.documentId}`, {
        state: nextState,
      });

      if (work.type === "EDIT") {
        await axios.patch(
          `${process.env.API_PATH}documents/${work.editDocumentId}`,
          {
            state: result ? "OBSOLETE" : "RELEASED",
          }
        );
      }

      await updateWorkState("COMPLETED");
    },
    [work]
  );
  return (
    <>
      <Row>
        <div className="col-3">
          <h2 className="pb-5">Work Detail</h2>
        </div>
        <div className="col-9 text-right">
          <div className="mt-2">
            <WorkStateBadges state={work.state} />
          </div>
        </div>
      </Row>

      <h3>{workTitle}</h3>
      <p className="text-muted">
        <small>{work.create_date}</small>
      </p>
      <Row>
        <Col>
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
        </Col>
        <Col>
          <Row>
            <div className="card bg-16 w-100">
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
          </Row>
        </Col>
        {work.state === "REVIEW" && userGroup === "DocumentControlClerk" && (
          <Col>
            <ActionCard header="Review Actions">
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
            </ActionCard>
          </Col>
        )}
        {work.state === "NEW" && (
          <Col>
            <ActionCard header="Action">
              <button
                className="btn btn-block btn-info"
                onClick={async () => {
                  await updateWorkState("REVIEW");
                }}
              >
                Submit For Review
              </button>
            </ActionCard>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Work;
