import { getSession } from "next-auth/client";

/**
 * Require authentication before accessing the page
 * Place inside getServerSideProps on page that need to be protected
 * @param context getServerSideProps context object
 */
export const restrictPage = async (context) => {
  const session = await getSession(context);
  if (!session) {
    context.res.statusCode = 302;
    context.res.setHeader("Location", "/auth/signin"); // TODO: Add return address
  }
};

/**
 * Require authentication on API route to be used as a middleware
 * @param req
 * @param res
 * @param next
 */
export const checkAuth = async (req, res, next) => {
  const session = await getSession({ req });
  if (session) next();
  else res.status(401).send("Unauthorized");
};
