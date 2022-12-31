import chalk from "chalk";
import Format from "string-format";
import { ClientConfig } from "./client-manager";

export class BaseClient {
  protected config?: ClientConfig;
  protected receiveText?: (text: string) => void;

  public setConfig(config: ClientConfig): void {
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
    return Format(ClientConfig.briefTemplate, args);
  }

  public setReceive(receiveText: (text: string) => void): void {
    this.receiveText = receiveText;
  }

  public clearReceive() {
    this.receiveText = undefined;
  }
}