import { SerialCommander } from "./serial-commander";
import prompts from "prompts";
import { print } from "./util";

const serialCommander = new SerialCommander({
  port: "COM3", // defaults to /dev/modem
  baudrate: 9600, // defaults to 115200
  readDelimiter: "\r", // defaults to '/n'
  writeDelimiter: "\r", // defaults to '/r/n'
  disableLog: false, // defaults to false
  defaultDelay: 1000, // delay [ms] before the command is issued defaults to 100
  log: (text:string | string[]) => print(`[${new Date().toISOString()}] ${text}`) // default logging function
});

async function main () {
    const flag = true;
    while(flag){
        const result = await prompts({
            type: "text",
            name: "command",
            message: "请输入指令：",
            initial: ""
          });

          const command = result.command;

        const options = {
          expectedResponses: ["Username:", "Password:", ">"], // defaults to ['OK']
          timeout: 50000,  // defaults to 1000
          delay: 100 // defaults to defaultDelay set in the constructor
        };
        const response = await serialCommander.send(command, options);
        print(response);
    }
}

main();