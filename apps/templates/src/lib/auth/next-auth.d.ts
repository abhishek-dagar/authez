import NextAuth from "next-auth";
import type { User } from "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends User {}
}

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    password?: string;
  }
}
