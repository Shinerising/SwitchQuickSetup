import chalk from "chalk";
import Format from "string-format";
import { ClientConfig } from "./client-manager";

export class BaseClient {
  private static briefTemplate = "交换机型号：{model}\n登录方法：{method}\n目标地址：{target}\n用户名：{user}";
  private static infoTemplate = "正在使用{method}方式访问{target}";
  protected config?: ClientConfig;
  protected receiveText?: (text: string) => void;

  public setConfig(config: ClientConfig): void {
    this.config = config;
  }

  public getInfo(): string{
    if (!this.config) {
      return "";
    }
    const args = {
      method: chalk.bold(this.config.method),
      target: chalk.bold(this.config.target)
    };
    return Format(BaseClient.infoTemplate, args);
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
    return Format(BaseClient.briefTemplate, args);
  }

  public setReceive(receiveText: (text: string) => void): void {
    this.receiveText = receiveText;
  }

  public clearReceive() {
    this.receiveText = undefined;
  }
}