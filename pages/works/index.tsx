import axios from "axios";
import { restrictPage } from "@modules/Auth";
import { getSession } from "next-auth/client";
import WorksTable from "@components/WorksTable";
import { sortById } from "@modules/Utils";
import Head from "next/head";
import React from "react";

export const getServerSideProps = async (context) => {
  await restrictPage(context);

  const serverUser = await getSession(context);
  const { data } = await axios.get(`${process.env.API_PATH}works/`);
  sortById(data);

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
      <Head>
        <title>Work List</title>
      </Head>

      <h2 className="pb-5">View All Works</h2>
      <WorksTable works={works} user={serverUser} />
    </>
  );
};

export default WorkList;
