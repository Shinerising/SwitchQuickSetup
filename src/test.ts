/* eslint-disable */

//import { configBackupCommand } from "./command-collection";
//import { executeCommand } from "./command-manager";
import fs from "fs";
import path from "path";
import AES from "crypto-js/aes";
import enc from "crypto-js/enc-utf8";
import { ClientConfig, clientWrapper } from "./client-manager";
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

const secret = "MIICXQIBAAKBgQDC";
const configFile = "switch.conf";

const loadConfigFile = () => {
  const filename = path.join(__dirname, configFile);
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(path.join(__dirname, configFile)).toString();
    const decrypted = AES.decrypt(data, secret);
    console.log(decrypted.toString(enc));
    const config = JSON.parse(decrypted.toString(enc)) as ClientConfig;
    return config;
  }
  try {
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(path.join(__dirname, configFile)).toString();
      const decrypted = AES.decrypt(data, secret);
      const config = JSON.parse(decrypted.toString()) as ClientConfig;
      return config;
    }
  }
  catch {
    return null;
  }
  return null;
};

console.log(loadConfigFile());

*/

startServer(__dirname);

const file = await waitForPut(20000);
console.log(file);
stopServer();

