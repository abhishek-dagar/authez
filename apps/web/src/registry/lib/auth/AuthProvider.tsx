"use client";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

interface AuthProvidersProps extends SessionProviderProps {}

export default function AuthProviders({
  children,
  ...props
}: AuthProvidersProps) {
  return <SessionProvider {...props}>{children}</SessionProvider>;
}
