import { SerialCommander } from "./serial-commander";
import prompts from "prompts";
import { print } from "./util";
import { SerialClient } from "./client-serial";

async function main() {
  const flag = true;
  while (flag) {
    const result = await prompts({
      type: "text",
      name: "command",
      message: "请输入指令：",
      initial: ""
    });

    const serialCommander = new SerialCommander({
      port: "COM3", // defaults to /dev/modem
      baudrate: 9600, // defaults to 115200
      readDelimiter: "\n", // defaults to '/n'
      writeDelimiter: "\n", // defaults to '/r/n'
      disableLog: true, // defaults to false
      defaultDelay: 1000, // delay [ms] before the command is issued defaults to 100
      log: (text: string | string[]) => print(`${text}`) // default logging function
    });

    const command = result.command;

    const options = {
      expectedResponses: ["OK"], // defaults to ['OK']
      timeout: 1000,  // defaults to 1000
      delay: 100 // defaults to defaultDelay set in the constructor
    };
    try {
      const response = await serialCommander.send(command, options);
      print(response);
    }
    catch (e) {
      print(e);
    }
  }
}

//main();

const client = new SerialClient();
client.setConfig({ user: "admin", password: "admin@huawei", passwordNew: "admin@huawei", target: "COM3", model: "other", method: "other" });

await client.start();
await client.login();
await client.close();
