import { TelnetClient } from "./client-telnet";

export class ClientConfig {
  public static briefTemplate = "交换机型号：{model}；登录方法：{method}；目标地址：{target}；用户名：{user}";
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
  private config: ClientConfig | null;

  constructor() {
    this.client = new TelnetClient("telehack.com");
    this.config = null;
  }

  public applyConfig(config: ClientConfig) {
    this.config = config;
  }

  public getBrief(): string {
    if (!this.client) {
      return "";
    }
    return this.client?.getBrief();
  }

  public async tryLogin() {
    if (!this.client) {
      return false;
    }
    await this.client.start();
    await this.client.login();
    await this.client.close();
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
  start(): Promise<void>;
  close(): Promise<void>;
  login(): Promise<void>;
  execute(command: string): Promise<void>;
  setReceive(receiveText: (text: string) => void): void;
  clearReceive(): void;
}

export const clientWrapper: ClientWrapper = new ClientWrapper();