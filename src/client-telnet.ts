import { Telnet } from "telnet-client";
import { Client, SwitchLoginConfig } from "./client-manager";
import { delay } from "./util";

export class TelnetClient implements Client {
  private config?: SwitchLoginConfig;
  private receiveText?: (text: string) => void;
  private connection = new Telnet();
  private params = {
    port: 23,
    host: "",
    shellPrompt: "\\.",
    ors: "\r\n",
    timeout: 3000,
    execTimeout: 3000
  };

  constructor(host: string) {
    this.params.host = host;
  }

  public setConfig(config: SwitchLoginConfig): void {
    this.config = config;
  }

  public getBrief(): string {
      return "";
  }

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

  public setReceive(receiveText: (text: string) => void): void {
    this.receiveText = receiveText;
  }

  public clearReceive() {
    this.receiveText = undefined;
  }
}