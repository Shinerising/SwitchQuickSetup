import { Client, ClientConfig } from "./client-manager";
import { print } from "./util";
import { BaseClient } from "./client-base";
import { SerialCommander } from "./serial-commander";
import { delay } from "./util";

export class SerialClient extends BaseClient implements Client {

  private serialCommander: SerialCommander | null;

  constructor() {
    super();
    this.serialCommander = null;
  }

  public async start(): Promise<void> {
    if (!this.config) {
      return;
    }
    this.serialCommander = new SerialCommander({
      port: this.config.target,
      baudrate: 9600,
      readDelimiter: "\n",
      writeDelimiter: "\n",
      disableLog: true,
      defaultDelay: 1000,
      log: (text: string | string[]) => print(text) 
    });
  }

  public async close(): Promise<void> {
    this.serialCommander?.close();
  }

  public async login(): Promise<string | null | void> {
    if(!this.config || !this.serialCommander){
      return;
    }
    let command:string;
    let response:string;

    response = await this.serialCommander.send("");
    command = this.config.user;
    response = await this.serialCommander.send(command);
    console.log(response);
    command = this.config.password;
    response = await this.serialCommander.send(command);
    console.log(response);

    if(this.config.password === ClientConfig.defaultPassword){
      response = await this.serialCommander.send("Y");
      command = this.config.password;
      response = await this.serialCommander.send(command);
      console.log(response);
      command = this.config.passwordNew;
      response = await this.serialCommander.send(command);
      console.log(response);
      command = this.config.passwordNew;
      response = await this.serialCommander.send(command);
      console.log(response);
    }
    console.log("DO display version");
    command = "display version";
    response = await this.serialCommander.send(command);
    console.log(response);
    const a = await this.serialCommander.send("quit");
    console.log(a);
    return response;
  }

  public async execute(command: string): Promise<void> {
    const result = await this.serialCommander?.send(command);
    if(this.receiveText){
      this.receiveText(result || "");
    }
  }
}