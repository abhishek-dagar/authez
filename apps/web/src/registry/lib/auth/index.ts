import { getServerSession } from "next-auth";
import { BuiltInProviderType } from "next-auth/providers/index";
import {
  LiteralUnion,
  signIn,
  SignInAuthorizationParams,
  SignInOptions,
  signOut,
  useSession,
} from "next-auth/react";
import React from "react";
import { authOptions } from "./options";

export const SignIn = async (
  provider?: LiteralUnion<BuiltInProviderType> | undefined,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
) => {
  await signIn(provider, options, authorizationParams);
};

export const SignOut = async () => {
  await signOut();
};

export function useClientUser() {
  const [user, setUser] = React.useState();
  const { data: session } = useSession();

  React.useEffect(() => {
    if (session) {
      setUser(session.user as any);
    }
  }, [session]);

  return user;
}

export async function GetSeverUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}