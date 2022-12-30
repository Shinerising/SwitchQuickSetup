import chalk from "chalk";
import Format from "string-format";
import { Client, SwitchLoginConfig } from "./client-manager";
import { print } from "./util";

export class SerialClient implements Client {
  private config?: SwitchLoginConfig;
  private receiveText?: (text: string) => void;

  public setConfig(config: SwitchLoginConfig): void {
    this.config = config;
  }

  public getBrief(): string {
    if (!this.config) {
      return "";
    }
    const args = {
      model: chalk.bold(this.config.model),
      method: chalk.bold(this.config.method),
      target: chalk.bold(this.config.target),
      user: chalk.bold(this.config.user)
    };
    return Format(SwitchLoginConfig.briefTemplate, args);
  }

  public async start(): Promise<void> {
    print("start");
  }

  public async close(): Promise<void> {
    print("close");
  }

  public async login(): Promise<void> {
    print("login");
  }

  public async execute(command: string): Promise<void> {
    print(command);
  }

  public setReceive(receiveText: (text: string) => void): void {
    this.receiveText = receiveText;
  }

  public clearReceive() {
    this.receiveText = undefined;
  }
}