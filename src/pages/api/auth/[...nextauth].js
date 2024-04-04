import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook"
import { CLIENT_ID, CLIENT_SECRET,FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, NEXTAUTH_SECRET } from "@/utils/configs/googleService";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    }),
    FacebookProvider({
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET
    }),
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    session: async({ session, token, user }) => {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    jwt: async({ token, user, account, profile, isNewUser }) => {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },

})