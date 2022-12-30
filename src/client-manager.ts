import { TelnetClient } from "./client-telnet";

export class ClientConfig {
  public static defaultUser = "admin";
  public static defaultPassword = "admin@huawei.com";
  public type = "other";
  public method: "serial" | "ethernet" | "telnet" | "other" = "other";
  public target = "serial";
  public user = "admin";
  public password = "password";
  public passwordNew = "";
  public delay = 1000;
}

export class ClientWrapper {
  private client: Client | null;
  private config: ClientConfig | null;

  constructor() {
    this.client = new TelnetClient("telehack.com");
    this.config = null;
  }

  public applyConfig(config:ClientConfig){
    this.config = config;
  }

  public getBrief():string{
    if(!this.config){
      return "";
    }
    return this.config.method;
  }

  public async executeCommandList(commands: string[], sendText: (text: string) => void, receiveText: (text: string) => void) {
    if(!this.client){
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
    if(!this.client){
      return;
    }
    await this.client.execute(command);
  }
}

export class SwitchLoginConfig {
  static briefTemplate = "";
  static defaultUser = "admin";
  static defaultPassword = "admin@huawei.com";
  model = "other";
  method = "other";
  target = "serial";
  user = "admin";
  password = "password";
  passwordNew = "passwordNew";
}

export interface Client {
  setConfig(config: SwitchLoginConfig): void;
  getBrief():string;
  start(): Promise<void>;
  close(): Promise<void>;
  login(): Promise<void>;
  execute(command: string): Promise<void>;
  setReceive(receiveText: (text: string) => void): void;
  clearReceive(): void;
}

export const clientWrapper: ClientWrapper = new ClientWrapper();