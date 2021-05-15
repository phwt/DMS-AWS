import { Form } from "react-bootstrap";
import WorkTypeBadge from "@components/WorkTypeBadge";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  works: any[];
  user: {
    groups: string[];
    user: {
      name: string;
    };
  };
}

const WorksTable = ({ works, user }: Props) => {
  const router = useRouter();
  const workType = ["-", "Create", "Edit", "Cancel"];
  const workState = ["-", "NEW", "REVIEW", "COMPLETED"];
  const [typeSelect, setTypeSelect] = useState("-");
  const [stateSelect, setStateSelect] = useState("-");

  return (
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
              if (
                !(user.groups.includes("Employee") && work.state === "REVIEW")
              ) {
                return (
                  <tr key={work.id}>
                    <td>{work.document.name}</td>
                    <td>
                      <WorkTypeBadge type={work.type} />
                    </td>
                    <td>{work.state[0] + work.state.toLowerCase().slice(1)}</td>
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
  );
};

export default WorksTable;
