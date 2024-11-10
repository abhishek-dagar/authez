#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init";
import { add } from "./commands/add";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("authez")
    .description("Add authentication to your project")
    .version("1.0.0", "-v, --version", "display the version number");

  program.addCommand(init).addCommand(add);

  //   program.addCommand(init).addCommand(add).addCommand(diff)

  program.parse();
}

main();
