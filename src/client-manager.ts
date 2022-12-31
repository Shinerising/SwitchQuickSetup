import { TelnetClient } from "./client-telnet";

export class ClientConfig {
  public static defaultUser = "admin";
  public static defaultPassword = "admin@huawei.com";
  public model = "other";
  public method: "serial" | "telnet" | "ethernet" | "other" = "other";
  public target = "";
  public user = "admin";
  public password = "password";
  public passwordNew = "passwordNew";
}

export class ClientWrapper {
  private client: Client | null;

  constructor() {
    this.client = new TelnetClient("telehack.com");
  }

  public applyConfig(config: ClientConfig) {
    this.client?.setConfig(config);
  }

  public getBrief(): string {
    if (!this.client) {
      return "";
    }
    return this.client?.getBrief();
  }

  public getInfo(): string {
    if (!this.client) {
      return "";
    }
    return this.client?.getInfo();
  }

  public async tryLogin() {
    if (!this.client) {
      return false;
    }
    //await this.client.start();
    //await this.client.login();
    //await this.client.close();
    return true;
  }

  public async executeCommandList(commands: string[], sendText: (text: string) => void, receiveText: (text: string) => void) {
    if (!this.client) {
      return;
    }
    this.client.setReceive(receiveText);

    await this.client.start();
    await this.client.login();

    for (const command of commands) {
      sendText(command);
      await this.executeCommand(command);
    }

    await this.client.close();

    this.client.clearReceive();
  }

  private async executeCommand(command: string) {
    if (!this.client) {
      return;
    }
    await this.client.execute(command);
  }
}

export interface Client {
  setConfig(config: ClientConfig): void;
  getBrief(): string;
  getInfo(): string;
  start(): Promise<void>;
  close(): Promise<void>;
  login(): Promise<void>;
  execute(command: string): Promise<void>;
  setReceive(receiveText: (text: string) => void): void;
  clearReceive(): void;
}

export const clientWrapper: ClientWrapper = new ClientWrapper();