import { NextResponse } from "next/server";
import fs, { readFileSync } from "fs";
import path from "path";
import config from "@/registry/configs.json";

type Params = Promise<{ slug: string }>;

// Function to read data from auth-files folder with dynamic list of filenames
const readAuthFilesData = async (
  fileNames: { filename: string; folder: string; isEnv?: boolean }[]
) => {
  const promises = fileNames.map((file) => {
    const { filename, folder } = file;
    const filePath = path.join(
      process.cwd(),
      "src/registry",
      folder || "",
      filename
    ); // Use the provided filename
    if (!fs.existsSync(filePath)) {
      return { ...file, data: null };
    }
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (file.isEnv)
            resolve({
              ...file,
              data: parseEnvFile(data, ["default", "google"]),
            });
          resolve({ ...file, data }); // Return both filename and data
        }
      });
    });
  });

  return Promise.all(promises); // Wait for all file reads to complete
};

// Function to read .env.local and create an array based on comments
function parseEnvFile(fileContent: string, sections: string[]) {
  const lines = fileContent.split("\n");
  const result: { [key: string]: string[] } = {}; // Define the type for result
  let currentSection = "";

  lines.forEach((line) => {
    line = line.trim();

    if (line.startsWith("#")) {
      currentSection = line.replace("# ", "").toLowerCase();
      if (sections.includes(currentSection)) {
        result[currentSection] = []; // Only initialize if section is included
      }
    } else if (line && currentSection && result[currentSection]) {
      // Add variable to the current section if it exists in the result
      result[currentSection]?.push(line);
    }
  });

  return result;
}

const readProvidersFilesData = async (providers: string[]) => {
  const envFilePath = path.join(process.cwd(), "src/registry", ".env.local");
  let envData: any = readFileSync(envFilePath, "utf-8");
  envData = parseEnvFile(envData, providers);
  const promises = providers.map((provider) => {
    const filePath = path.join(
      process.cwd(),
      "src/registry/lib/auth",
      "providers",
      `${provider}.tsx`
    );

    const name = config.providers.find((p: any) => p.file === provider)?.name;
    if (!name) throw new Error(`Provider ${provider} not found`);
    if (!fs.existsSync(filePath)) {
      return { name, file: provider, data: null };
    }
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({ name, file: provider, data, envData: envData[provider] }); // Return both filename and data
        }
      });
    });
  });
  return Promise.all(promises);
};

export const GET = async (
  request: Request,
  segmentData: { params: Params }
) => {
  const params = await segmentData.params;

  const folders = config.folders;

  let files: {
    filename: string;
    folder: string;
    data?: string;
    isEnv?: boolean;
  }[] = config.files;

  files = (await readAuthFilesData(files)) as any; // Read data from auth-files

  return NextResponse.json({ ok: true, folders, files }); // Return the data in the response
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // const authData = await readAuthFilesData([".env.local"]); // Read data from auth-files
    // console.log(authData); // Log the data for debugging
    const { providers } = body;
    if (providers) {
      const providersData = await readProvidersFilesData(providers);
      return NextResponse.json({ ok: true, providersData });
    }
    return NextResponse.json({ ok: true, providers: config.providers });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
