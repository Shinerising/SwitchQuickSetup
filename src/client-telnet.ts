import { Telnet } from "telnet-client";
import { Client } from "./client-manager"

export class TelnetClient implements Client {
  public username = "";
  public password = "";
  public newpassword = "";
  private receiveText?: (text: string) => void;
  private connection = new Telnet()
  private params = {
    port: 23,
    host: "",
    shellPrompt: "\\.",
    ors: "\r\n",
    timeout: 3000,
    execTimeout: 3000
  }

  constructor(host: string) {
    this.params.host = host;
  }

  public async start(): Promise<void> {
    await this.connection.connect(this.params);
  }

  public async close(): Promise<void> {
    await this.connection.end();
  }

  public async login(): Promise<void> {
    console.log("login");
  }

  public async execute(command: string): Promise<void> {
    const result = await this.connection.exec(command)
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