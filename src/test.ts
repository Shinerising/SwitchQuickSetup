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
import { Telnet } from "telnet-client";
import { TelnetCommander } from "./telnet-commander";

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


startServer(__dirname);

const file = await waitForPut(20000);
console.log(file);
stopServer();
*/
const connection = new Telnet()

// these parameters are just examples and most probably won't work for your use-case.
const params = {
  host: '172.16.34.1',
  port: 23,
  irs: "\n",
  ors: "\n",
  shellPrompt: /\<.*\>|:/gi, // or negotiationMandatory: false
  loginPrompt: /Username:/i,
  passwordPrompt: /Password:/i,
  username: "admin",
  password: "admin@huawei",
  timeout: 1500,
  echoLines: 0,
  stripShellPrompt: false
}

try {
  await connection.connect(params)
} catch (error) {
  console.error(error);
}

connection.on("data", (data) => {
  //console.log(data.toString());
});

let res : string;
res = await connection.exec('')
console.log('async result:', res)
res = await connection.exec('admin')
console.log('async result:', res)
res = await connection.exec('admin@huawei')
console.log('async result:', res)
res = await connection.exec('display version')
console.log('async result:', res)
await delay(3000);
connection.end();
