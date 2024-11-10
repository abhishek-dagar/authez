import axios from "axios";
import { Command } from "commander";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { logger } from "../utils/logger";
import { getEnvFileData } from "../utils/get-env-file-data";

export const add = new Command()
  .name("add")
  .description("add providers to authOptions")
  .option("-p,--providers <providers...>", "the provider to add")
  .option("-f,--forms <formtype>", "the provider to add")
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (options) => {
    const cwd = path.resolve(options.cwd);

    if (options.providers) {
      addProviders(options.providers, cwd);
    }
    if (options.forms) {
      addForms(options.forms, cwd);
    }
  });

async function addProviders(providers: string[], cwd: string) {
  const providersFilePath = path.join(cwd, "src/lib/auth/providers.json");
  const authProvidersDir = path.join(cwd, "src/lib/auth/providers");
  const envFilePath = path.join(cwd, ".env.local");

  // Read the providers from provider.json
  let existingProviders: { name: string; file: string }[] = [];
  if (existsSync(providersFilePath)) {
    const data = readFileSync(providersFilePath, "utf-8");
    existingProviders = JSON.parse(data).providers;
  }

  const { data } = await axios.post(
    "http://localhost:3001/api/registery/providers",
    {
      providers,
    }
  );

  if (!data.ok) {
    logger.error(data.error);
    return;
  }

  const fetchedProviders: {
    name: string;
    file: string;
    data: string;
    envData: string[];
  }[] = data.providersData;
  // Iterate over each provider
  fetchedProviders.forEach(async ({ name, file, data, envData }) => {
    // Check if the provider is in the existing providers
    const existingProvider = existingProviders.find(
      (p: any) => p.file === file
    );

    const providerFilePath = path.join(authProvidersDir, `${file}.tsx`);
    if (existingProvider) {
      // Check if the provider file exists
      if (existsSync(providerFilePath)) {
        console.log(`Provider file already exists`);
        return; // Exit if the file already exists
      } else {
        // Create the provider file with empty content
        writeFileSync(providerFilePath, "", "utf-8");
        // console.log(`Created provider file: ${providerFilePath}`);
      }
    } else {
      writeFileSync(providerFilePath, data, "utf-8");
      const newEnvData = getEnvFileData(envFilePath, { [`${file}`]: envData });
      writeFileSync(envFilePath, newEnvData, "utf-8");
      existingProviders.push({ name, file });
      // console.log(`Provider not found in provider.json: ${file}`);
    }
  });
  writeFileSync(
    providersFilePath,
    JSON.stringify({ providers: existingProviders }, null, 2),
    "utf-8"
  );
}

async function addForms(forms: string[], cwd: string) {
  const res = await axios.get(`http://localhost:3001/r/styles/${forms}.json`);
  const { files } = await res.data;
  files.forEach((file: any) => {
    const filePath = path.join(cwd, "src", file.target);
    const dirPath = path.dirname(filePath); // Get the directory path
    console.log(dirPath);

    // Create the directory if it doesn't exist
    mkdirSync(dirPath, { recursive: true }); // Create directories recursively
    writeFileSync(filePath, file.content, "utf-8");
  });
}
