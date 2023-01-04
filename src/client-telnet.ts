import { Telnet } from "telnet-client";
import { Client } from "./client-manager";
import { delay } from "./util";
import { BaseClient } from "./client-base";

export class TelnetClient extends BaseClient implements Client {
  private connection = new Telnet();
  private params = {
    port: 23,
    host: "",
    shellPrompt: "\\.",
    ors: "\r\n",
    timeout: 3000,
    execTimeout: 3000
  };

  public async start(): Promise<void> {
    await this.connection.connect(this.params);
  }

  public async close(): Promise<void> {
    await this.connection.end();
  }

  public async login(): Promise<void> {
    if(!this.config){
      return;
    }
    let command:string;
    let response:string;

    command = this.config.user;
    response = await this.connection.exec(command);
    await delay(200);
    command = this.config.password;
    response = await this.connection.exec(command);

    if(response === "123"){
      command = this.config.passwordNew;
      response = await this.connection.exec(command);
    }
  }

  public async execute(command: string): Promise<void> {
    const result = await this.connection.exec(command);
    if(this.receiveText){
      this.receiveText(result);
    }
  }
}