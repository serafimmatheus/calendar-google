import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl: string;
  }

  interface Session {
    user: User;
  }
}
