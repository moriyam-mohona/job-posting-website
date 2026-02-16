import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

const githubClientId =
  process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID ?? "";
const githubClientSecret =
  process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_SECRET ?? "";

if (!githubClientId || !githubClientSecret) {
  throw new Error(
    "Missing GitHub OAuth env vars. Set AUTH_GITHUB_ID/AUTH_GITHUB_SECRET or GITHUB_ID/GITHUB_SECRET.",
  );
}

const authConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
