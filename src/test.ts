//import { configBackupCommand } from "./command-collection";
//import { executeCommand } from "./command-manager";
import { clientWrapper } from "./client-manager";
import chalk from "chalk";
import { print } from "./util";

//await executeCommand(configBackupCommand);

const commands = "joke\ngif";
await clientWrapper.executeCommandList(commands.split("\n"), (text: string) => {
  print(chalk.blueBright(text));
}, (text: string) => {
  print(chalk.yellow(text));
});