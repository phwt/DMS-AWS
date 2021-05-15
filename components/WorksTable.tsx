import { Form } from "react-bootstrap";
import WorkTypeBadge from "@components/WorkTypeBadge";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

interface Props {
  works: any[];
  user: {
    groups: string[];
    user: {
      name: string;
    };
  };
  ownWork?: boolean;
}

const WorksTable = ({ works, user, ownWork = false }: Props) => {
  const router = useRouter();
  const workType = ["-", "Create", "Edit", "Cancel"];
  const workState = ["-", "NEW", "REVIEW", "COMPLETED"];
  const [typeSelect, setTypeSelect] = useState("-");
  const [stateSelect, setStateSelect] = useState("-");

  const workFilter = useCallback(
    (w) => {
      return (
        // Filter works by select option
        (w.type === typeSelect || typeSelect === "-") &&
        (w.state === stateSelect || stateSelect === "-") &&
        (ownWork
          ? // Show only works created by current user
            w.create_by === user.user.name ||
            // If user is DCC also show other works in REVIEW state
            (user.groups.includes("DocumentControlClerk") &&
              w.state === "REVIEW")
          : true)
      );
    },
    [typeSelect, stateSelect]
  );

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
              <Form.Control
                as="select"
                size="sm"
                onChange={(e) => setTypeSelect(e.target.value.toUpperCase())}
              >
                {workType.map((type) => (
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
                {workState.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Form.Control>
            </td>
            <td />
            <td />
            <td />
          </tr>

          {works.filter(workFilter).map((work) => {
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
