import { providers, signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export async function getServerSideProps(context) {
  const localProviders = await providers();
  return {
    props: { providers: localProviders },
  };
}

const SignIn = ({ providers }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (process.browser && !loading) {
      if (session) {
        router.push("/");
      } else {
        signIn("cognito");
      }
    }
  }, [session, loading]);

  return (
    <div className="text-center mt-5">
      {session && <h5>Signed in as {session.user.name}</h5>}
      <h5>Redirecting...</h5>
    </div>
  );
};

export default SignIn;
