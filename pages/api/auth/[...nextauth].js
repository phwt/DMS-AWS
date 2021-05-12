import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import jwtDecode from "jwt-decode";

export default NextAuth({
  providers: [
    Providers.Cognito({
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    }),
  ],
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    async session(session, token) {
      try {
        return {
          ...session,
          groups: jwtDecode(token.accessToken)["cognito:groups"],
        };
      } catch {
        return session;
      }
    },
  },
});
