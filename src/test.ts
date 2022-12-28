import path from 'path';
import prompts from 'prompts';
import {fileURLToPath} from 'url';
import { startServer, stopServer, waitForPut } from "./tftp-handler";

import { vlanEnableCommand } from "./command-collection";
import { executeCommand } from "./command-manager";

await executeCommand(vlanEnableCommand);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

startServer(__dirname);

console.log("TFTP Server Started!");

const result = await waitForPut(1000000);

console.log(result);

stopServer();