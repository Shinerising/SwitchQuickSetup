import { Client, ClientConfig } from "./client-manager";
import { BaseClient } from "./client-base";
import { TelnetCommander } from "./telnet-commander";

export class TelnetClient extends BaseClient implements Client {
  private telnetCommander: TelnetCommander | null;

  constructor() {
    super();
    this.telnetCommander = null;
  }

  public async start(): Promise<void> {
    if (!this.config) {
      return;
    }
    const [ host, port ] = this.config.target.split(":");
    this.telnetCommander = new TelnetCommander({
      port: port ? parseInt(port) : 23,
      host: host,
      shellPrompt: null,
      negotiationMandatory: false,
      irs: "\n",
      ors: "\n",
      timeout: 1000,
      sendTimeout: 200,
    });
    await this.telnetCommander.open();
  }

  public async close(): Promise<void> {
    if (!this.config || !this.telnetCommander) {
      return;
    }
    this.telnetCommander?.close();
  }

  public async login(getInfo = false): Promise<string | null | void> {
    if (!this.config || !this.telnetCommander) {
      return;
    }
    let command: string;
    let response: string;

    response = await this.telnetCommander.send("");

    if(this.config.login) {
      command = this.config.user;
      response = await this.telnetCommander.send(command);
      command = this.config.password;
      response = await this.telnetCommander.send(command);
  
      if (this.config.password === ClientConfig.defaultPassword) {
        response = await this.telnetCommander.send("Y");
        command = this.config.password;
        response = await this.telnetCommander.send(command);
        command = this.config.passwordNew;
        response = await this.telnetCommander.send(command);
        command = this.config.passwordNew;
        response = await this.telnetCommander.send(command);
      }
    }

    if (getInfo) {
      command = "display version";
      response = await this.telnetCommander.send(command);
      return response;
    }
  }

  public async execute(command: string, timeout?: number): Promise<string | undefined> {
    const result = timeout ? await this.telnetCommander?.send(command, { timeout }) : await this.telnetCommander?.send(command);
    if (this.receiveText) {
      this.receiveText(result || "");
    }
    return result;
  }
}