import { Client } from "./client-manager";
import { print } from "./util";
import { BaseClient } from "./client-base";

export class SerialClient extends BaseClient implements Client {

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
}