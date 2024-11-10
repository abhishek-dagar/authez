import { NextAuthOptions } from "next-auth";
import providersConfig from "./providers.json";

// Define the authOptions without providers initially
export const authOptions: NextAuthOptions = {
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        delete user["password"];
        token = { ...user };
        return token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user && token) {
        session.user = token;
      }
      return session;
    },
  },
};

// Function to add providers dynamically based on providers.json
(async function addProviders() {
  const providers = await Promise.all(
    providersConfig.providers.map(async (provider) => {
      const { default: ProviderName } = await import(
        `./providers/${provider.file}`
      );

      return ProviderName;
    })
  );

  // Assign the dynamically loaded providers to authOptions
  authOptions.providers = providers;
})();
