import GitHubProvider from "next-auth/providers/github";

const ProviderGitHub = GitHubProvider({
  clientId: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_SECRET || "",
});

export default ProviderGitHub;
