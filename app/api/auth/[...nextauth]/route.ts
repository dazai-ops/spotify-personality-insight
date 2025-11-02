import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import type { JWT } from "next-auth/jwt";
import type { Account, Session } from "next-auth";

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
].join(",");

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes}&show_dialog=true`,
      // authorization: `https://accounts.spotify.com/authorize?scope=${scopes}`, (for no login dialog)
    })
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account} : {token: JWT, account: Account | null}) {
      if(account){
        // console.log("JWT-this TOKEN", token)
        // console.log("JWT-this ACCOUNT", account)
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token } : {session: Session, token: JWT}) {
      // console.log("SESSION-this SESSION", session)
      // console.log("SESSION-this TOKEN", token)
      session.accessToken = token.accessToken
      return session
    },
    async redirect({baseUrl} : {url: string, baseUrl: string}) {
      return `${baseUrl}/home`
    }
  },
  logger: {
    error(code: string, metadata) {
      // console.error("NextAuth ERROR:", code, metadata);
    },
    warn(code: string) { 
      // console.warn("NextAuth WARN:", code); 
    },
    debug(code: string, metadata) {
      // console.debug("NextAuth DEBUG:", code, metadata); 
    },
  }
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}