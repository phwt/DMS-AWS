import axios from "axios";
import { restrictPage } from "@modules/Auth";
import { getSession } from "next-auth/client";
import WorksTable from "@components/WorksTable";

export const getServerSideProps = async (context) => {
  await restrictPage(context);
  const serverUser = await getSession(context);
  const { data } = await axios.get(`${process.env.API_PATH}works/`);
  data.sort((a, b) => (a.id < b.id ? 1 : -1));
  return {
    props: {
      works: data,
      serverUser,
    },
  };
};

const WorkList = ({ works, serverUser }) => {
  return (
    <>
      <h2 className="pb-5">My Works</h2>
      <WorksTable works={works} user={serverUser} ownWork={true} />
    </>
  );
};

export default WorkList;
