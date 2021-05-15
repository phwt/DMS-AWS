import axios from "axios";
import { restrictPage } from "@modules/Auth";
import { getSession } from "next-auth/client";
import WorksTable from "@components/WorksTable";

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
  return (
    <>
      <h2 className="pb-5">View All Works</h2>
      <WorksTable works={works} user={serverUser} />
    </>
  );
};

export default WorkList;
