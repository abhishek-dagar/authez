import { existsSync, readFileSync } from "fs";

export function getEnvFileData(
  envFilePath: string,
  data: Record<string, string[]> | null
): string {
  if (!data) {
    return "";
  }

  // Initialize new data string
  let newDataString = "";

  // Check for existing variables in the env file
  if (existsSync(envFilePath)) {
    const envFileContent = readFileSync(envFilePath, "utf-8");
    const envFileLines = envFileContent.split("\n");

    // Create a set of existing variable names for quick lookup
    const existingVariables = new Set<string>();
    const commentedVariables: string[] = [];

    envFileLines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [variable] = trimmedLine.split("=");
        existingVariables.add(variable);
        newDataString += `${trimmedLine}\n`; // Add existing variable to newDataString
      } else if (trimmedLine.startsWith("#")) {
        commentedVariables.push(trimmedLine); // Store the commented line
      }
    });

    // Add commented variables to the new data string
    commentedVariables.forEach((commentedLine) => {
      newDataString += `${commentedLine}\n`; // Add commented variables
    });

    // Iterate over the data object
    Object.keys(data).forEach((key) => {
      newDataString += `\n# ${key}\n`; // Add comment with the key from data
      data[key].forEach((value) => {
        const [variable] = value.split("="); // Extract the variable name

        // Check if the variable is already present in the env file
        if (!existingVariables.has(variable)) {
          // If the variable is not found, check if it's commented out
          if (commentedVariables.some((line) => line.includes(variable))) {
            // If the variable is commented out, add it from data
            newDataString += `${value}\n`; // Add variable from data
          }
        }
      });
    });
  }

  return newDataString;
}
