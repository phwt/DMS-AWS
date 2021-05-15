import axios from "axios";
import { Form } from "react-bootstrap";
import { useRouter } from "next/router";
import { restrictPage } from "@modules/Auth";
import { useState } from "react";
import { getSession } from "next-auth/client";

export const getServerSideProps = async (context) => {
  await restrictPage(context);
  const serverUser = await getSession(context);
  const { data } = await axios.get(`${process.env.API_PATH}works/`);

  return {
    props: {
      works: data,
      serverUser,
    },
  };
};

export const WorkTypeBadge = ({ type }) => {
  switch (type) {
    case "CREATE":
      return <span className="badge badge-pill badge-success">Create</span>;
    case "EDIT":
      return <span className="badge badge-pill badge-warning">Edit</span>;
    case "CANCEL":
      return <span className="badge badge-pill badge-danger">Cancel</span>;
  }
};

const WorkList = ({ works, serverUser }) => {
  const router = useRouter();
  const workType = ["-", "Create", "Edit", "Cancel"];
  const workState = ["-", "NEW", "REVIEW", "COMPLETED"];
  const [typeSelect, setTypeSelect] = useState("-");
  const [stateSelect, setStateSelect] = useState("-");
  const [userGroup] = useState(serverUser.groups[0]);

  return (
    <>
      <h2 className="pb-5">View All Works</h2>
      <form method="GET" action="">
        <div className="table-responsive table-mh">
          <table className="table table-borderless text-light">
            <thead className="bg-0">
              <tr>
                <th scope="col">Related Document</th>
                <th scope="col">Type</th>
                <th scope="col">State</th>
                <th scope="col">Create Date</th>
                <th scope="col">Complete Date</th>
                <th scope="col" />
              </tr>
            </thead>
            <tr>
              <td />
              <td>
                {/* TODO: Live filter by type and state */}
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => setTypeSelect(e.target.value.toUpperCase())}
                >
                  {workType.map((type) => (
                    <option>{type}</option>
                  ))}
                </Form.Control>
              </td>
              <td>
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) => setStateSelect(e.target.value.toUpperCase())}
                >
                  {workState.map((type) => (
                    <option>{type}</option>
                  ))}
                </Form.Control>
              </td>
              <td />
              <td />
              <td />
            </tr>

            {works
              .filter((w) => w.type === typeSelect || typeSelect === "-")
              .filter((w) => w.state === stateSelect || stateSelect === "-")
              .map((work) => {
                if (!(userGroup === "Employee" && work.state === "REVIEW")) {
                  return (
                    <tr key={work.id}>
                      <td>{work.document.name}</td>
                      <td>
                        <WorkTypeBadge type={work.type} />
                      </td>
                      <td>
                        {work.state[0] + work.state.toLowerCase().slice(1)}
                      </td>
                      <td>{work.create_date}</td>
                      <td>{work.complete_date ?? "-"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-block"
                          onClick={async () => {
                            await router.push(`/works/${work.id}`);
                          }}
                        >
                          <i
                            className="fa fa-chevron-right text-info"
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                }
              })}
          </table>
        </div>
      </form>
    </>
  );
};

export default WorkList;
