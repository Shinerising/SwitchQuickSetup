/* eslint-disable */

//import { configBackupCommand } from "./command-collection";
//import { executeCommand } from "./command-manager";
import { clientWrapper } from "./client-manager";
import chalk from "chalk";
import { print, __dirname, delay } from "./util";
import { startServer, stopServer, waitForPut, waitForGet } from "./tftp-handler";

//await executeCommand(configBackupCommand);
/*
const commands = "joke\ngif";
await clientWrapper.executeCommandList(commands.split("\n"), (text: string) => {
  print(chalk.blueBright(text));
}, (text: string) => {
  print(chalk.yellow(text));
});
*/

startServer(__dirname);

const file = await waitForGet(20000);
console.log(file);
stopServer();

