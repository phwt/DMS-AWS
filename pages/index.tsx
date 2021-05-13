import React from "react";
import axios from "axios";
import { DocumentStateBadge, documentTypeText } from "./documents";
import { WorkTypeBadge } from "./works";
import { useRouter } from "next/router";
import { restrictPage } from "@modules/Auth";

export const getServerSideProps = async (context) => {
  await restrictPage(context);

  const { data } = await axios.get(`${process.env.API_PATH}dashboard/`);

  return {
    props: {
      dashboard: data,
    },
  };
};

const DocumentSummaryCard = ({ value, text, icon, variant, borderColor }) => {
  return (
    <div className="col-3">
      <div
        className="card shadow py-2 bg-0 summary-card"
        style={{
          borderLeft: `0.25rem solid ${borderColor} !important`,
        }}
      >
        <div className="card-body">
          <div className="row no-gutters align-items-center">
            <div className="col-auto">
              <i
                className={`fa ${icon} text-${variant} fa-3x`}
                aria-hidden="true"
              />
            </div>
            <div className="col ml-3">
              <h3 className="card-title mb-0" id="doc_cnt_in">
                {value}
              </h3>
              <p className="card-text">{text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkSummaryCard = ({ value, text, variant }) => {
  return (
    <div className="col-6">
      <div className={`card bg-${variant} mb-4 card-pointer`}>
        <div className="card-body">
          <div className="row">
            <div className="col-5 p-0 text-center">
              <h1 className="font-l mb-0" id="work_cnt">
                {value}
              </h1>
            </div>
            <div className="col-7 p-0">
              <p className="card-text m-0">{text}</p>
              <h5 className="card-title m-0">Works</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ dashboard }) => {
  const router = useRouter();

  return (
    <>
      <h2 className="pb-5">Dashboard</h2>
      {/* {# Document Part #} */}
      <div className="row">
        <DocumentSummaryCard
          value={dashboard.summary.document.total}
          text="Documents"
          icon="fa-file"
          variant="white"
          borderColor="#ffffff"
        />

        <DocumentSummaryCard
          value={dashboard.summary.document.inProgress}
          text="In-Progress"
          icon="fa-file"
          variant="info"
          borderColor="#17a2b8"
        />

        <DocumentSummaryCard
          value={dashboard.summary.document.released}
          text="Released"
          icon="fa-arrow-circle-right"
          variant="success"
          borderColor="#28a745"
        />

        <DocumentSummaryCard
          value={dashboard.summary.document.obsoleted}
          text="Obsoleted"
          icon="fa-ban"
          variant="danger"
          borderColor="#dc3545"
        />

        {/* {# Document list last 10 #} */}
        <div className="col-12 col-lg-6">
          <div className="bg-0 pl-3 pr-1 pt-2 mt-3">
            <h4 className="m-0">Documents</h4>
            <p className="m-0 text-muted">Latest 10 Documents</p>
          </div>
          <table className="table table-borderless text-light" id="internal">
            <thead className="bg-0">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">State</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.latestDocuments.all.map((document) => (
                <tr key={document.id}>
                  <td>
                    <a
                      onClick={async (e) => {
                        e.preventDefault();
                        await router.push(`/documents/${document.id}`);
                      }}
                      href="#"
                    >
                      {document.name}
                    </a>
                  </td>
                  <td>{documentTypeText(document.type)}</td>
                  <td>
                    <DocumentStateBadge state={document.state} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* {# Document In-Progress last 10 #} */}
        <div className="col-6 col-lg-3">
          <div className="bg-0 pl-3 pr-1 pt-2 mt-3">
            <h4>Documents</h4>
            <span className="badge badge-pill badge-info">In-Progress</span>
          </div>
          <table className="table table-borderless text-light" id="progress">
            <thead className="bg-0">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.latestDocuments.inProgress.map((document) => (
                <tr key={document.id}>
                  <td>
                    <a
                      onClick={async (e) => {
                        e.preventDefault();
                        await router.push(`/documents/${document.id}`);
                      }}
                      href="#"
                    >
                      {document.name}
                    </a>
                  </td>
                  <td>{documentTypeText(document.type)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* {# Document Released last 10 #} */}
        <div className="col-6 col-lg-3">
          <div className="bg-0 pl-3 pr-1 pt-2 mt-3">
            <h4>Documents</h4>
            <span className="badge badge-pill badge-success">Released</span>
          </div>
          <table className="table table-borderless text-light" id="released">
            <thead className="bg-0">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.latestDocuments.released.map((document) => (
                <tr key={document.id}>
                  <td>
                    <a
                      onClick={async (e) => {
                        e.preventDefault();
                        await router.push(`/documents/${document.id}`);
                      }}
                      href="#"
                    >
                      {document.name}
                    </a>
                  </td>
                  <td>{documentTypeText(document.type)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* {# Work Part #} */}
      <div className="row">
        {/* {# Work Overview #} */}
        <div className="col-12 col-lg-6 mb-3 mb-lg-0 row">
          <WorkSummaryCard
            text="Total"
            value={dashboard.summary.work.total}
            variant="0"
          />

          <WorkSummaryCard
            text="Create"
            value={dashboard.summary.work.create}
            variant="success"
          />

          <WorkSummaryCard
            text="Edit"
            value={dashboard.summary.work.edit}
            variant="warning"
          />

          <WorkSummaryCard
            text="Cancel"
            value={dashboard.summary.work.cancel}
            variant="danger"
          />
        </div>

        {/* {#Work List last 10#} */}
        <div className="col-12 col-lg-6">
          <div className="bg-0 pl-3 pt-2">
            <h4>Works</h4>
            <p className="m-0 text-muted">Latest 10 Works</p>
          </div>
          <table className="table table-borderless text-light" id="work">
            <thead className="bg-0">
              <tr>
                <th scope="col">Related Document</th>
                <th scope="col">Type</th>
                <th scope="col">State</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.latestWorks.all.map((work) => (
                <tr key={work.id}>
                  <td>
                    <a
                      onClick={async (e) => {
                        e.preventDefault();
                        await router.push(`/works/${work.id}`);
                      }}
                      href="#"
                    >
                      {work.document.name}
                    </a>
                  </td>
                  <td>
                    <WorkTypeBadge type={work.type} />
                  </td>
                  <td>{work.state[0] + work.state.toLowerCase().slice(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
