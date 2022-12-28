import { configBackupCommand } from "./command-collection";
import { executeCommand } from "./command-manager";
import { clientWrapper } from "./client-manager";

//await executeCommand(configBackupCommand);

const commands = "joke\ngif";
await clientWrapper.executeCommandList(commands.split("\n"), (text: string) => {
  console.log(text);
}, (text: string) => {
  console.log(text);
});