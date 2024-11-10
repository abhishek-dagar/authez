import { existsSync, promises as fs } from "fs";
import path from "path";
import { Command } from "commander";
import { logger } from "../utils/logger";
import chalk from "chalk";
import ora from "ora";
import { getPackageManager } from "../utils/get-package-manager";
import { execa } from "execa";
import readline from "readline";
import axios from "axios";
import { getEnvFileData } from "../utils/get-env-file-data";

const PROJECT_DEPENDENCIES = ["next-auth"];

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-d, --defaults,", "use default configuration.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (options) => {
    // Ensure target directory exists.
    const cwd = path.resolve(options.cwd);
    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }
    await runInit(cwd);
    logger.info(
      `\n${chalk.bold.yellow(`Wrap children in layout.tsx with ${chalk.blue("<AuthProviders>")}`)}\n`
    );
    logger.info(
      `${chalk.green(
        "Success!"
      )} Project initialization completed. You may now add components.`
    );
  });

export async function runInit(cwd: string) {
  await createFolderStructure(cwd);

  // Install dependencies.
  const dependenciesSpinner = ora(`Installing dependencies...`)?.start();

  const packageJsonPath = path.join(cwd, "package.json");
  let dependenciesInstalled = false;

  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
    dependenciesInstalled = PROJECT_DEPENDENCIES.every(
      (dep) => packageJson.dependencies?.[dep]
    );
  }

  if (dependenciesInstalled) {
    logger.info(`\nDependencies are already installed.`);
    dependenciesSpinner?.succeed();
    return; // Exit if dependencies are already installed
  }

  const packageManager = await getPackageManager(cwd);

  const deps = [...PROJECT_DEPENDENCIES];

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...deps],
    {
      cwd,
    }
  );
  dependenciesSpinner?.succeed();
}

async function createFolderStructure(cwd: string) {
  const spinner = ora(`Initializing project...`)?.start();

  const response = await axios.get("http://localhost:3001/api/registery/init");
  let { folders, files } = response.data;
  folders = folders.map((folder: string) => path.join(cwd, folder));

  if (checkIfDirExists(folders)) {
    spinner?.stop(); // Stop the spinner before asking the user
    const userResponse = await askUser(
      `The authez is already initialized. Do you want to rewrite it? (yes(y)/no(n)): `
    );
    if (
      userResponse.toLowerCase() === "yes" ||
      userResponse.toLowerCase() === "y"
    ) {
      logger.info(`Re-initializing authez.`);
      await removeDir(folders);
    } else {
      logger.info(`Skipping initialization.`);
      process.exit(1);
    }
    spinner?.start(); // Restart the spinner after user input
  }

  for (const dir of folders) {
    await fs.mkdir(dir, { recursive: true });
    // Testing only
    // logger.info(`Directory ${path.basename(dir)} created.`);
  }

  await Promise.all(
    files.map(
      async (file: {
        folder: string;
        filename: string;
        data: string | null | Record<string, string[]>;
        isEnv: boolean;
      }) => {
        const filePath = file.folder
          ? path.join("src", file.folder, file.filename)
          : path.join(cwd, file.filename);

        if (file.isEnv && existsSync(filePath)) {
          // const newData = getEnvFileData(filePath, file.data) || ""; // New data to append
          const newData = getEnvFileData(filePath, file.data as any);

          await fs.writeFile(filePath, newData); // Append new data
          // Testing only
          // logger.info(
          //   `File ${path.basename(filePath)} already exists. Data appended.`
          // );
        } else if(typeof file.data === "string") {
          await fs.writeFile(filePath, file.data || "");
          // Testing only
          // logger.info(
          //   `File ${path.basename(filePath)} created and data added.`
          // );
        }
      }
    )
  );

  spinner?.succeed();
}

// Function to get user input
function askUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function checkIfDirExists(dirs: string[]) {
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      return false;
    }
  }
  return true;
}

async function removeDir(dirs: string[]) {
  for (const dir of dirs) {
    if (existsSync(dir)) {
      await fs.rm(dir, { recursive: true });
    }
  }
}
