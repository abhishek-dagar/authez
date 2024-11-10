import GoogleProvider from "next-auth/providers/google";

const ProviderGoogle = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
});

export default ProviderGoogle;
