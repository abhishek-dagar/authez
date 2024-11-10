import CredentialsProvider from "next-auth/providers/credentials";

const ProviderCredentials = CredentialsProvider({
  name: "Credentials",
  credentials: { id: { label: "ID", type: "text" } },
  async authorize(credentials) {
    try {
      if (!credentials) throw { error: "Something went wrong", status: 401 };
      const user = { ...(credentials as any) };
      return user;
    } catch (error) {
      throw { error: "Something went wrong", status: 401 };
    }
  },
});

export default ProviderCredentials;
