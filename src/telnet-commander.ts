import { Telnet } from "telnet-client";

declare interface TelnetCommanderOption {
  port: number;
  host: string;
  shellPrompt: string | null,
  negotiationMandatory: boolean,
  irs: string,
  ors: string,
  timeout: number,
  sendTimeout: number,
}

export class TelnetCommander {
  private option: TelnetCommanderOption;
  private defaultDelay: number;
  private defaultTimeout: number;
  private connection: Telnet;
  private fallbackSerialDataHandler: (data: Buffer) => void;
  private serialDataHandler: (data: Buffer) => void;
  constructor(option: TelnetCommanderOption = {
    port: 23,
    host: "",
    shellPrompt: null,
    negotiationMandatory: false,
    irs: "\n",
    ors: "\n",
    timeout: 1000,
    sendTimeout: 1000,
  }) {
    this.option = option;
    this.defaultDelay = 100;
    this.defaultTimeout = option.sendTimeout;
    this.fallbackSerialDataHandler = () => { return; };
    this.serialDataHandler = this.fallbackSerialDataHandler;
    this.connection = new Telnet();
    this.connection.on("data", (data: Buffer) => this.serialDataHandler(data));
  }

  async open() {
    await this.connection.connect(this.option);
  }

  async send(command: string, {
    timeout = this.defaultTimeout,
    delay = this.defaultDelay
  } = {}): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, delay));

    return new Promise((resolve, reject) => {
      const response: string[] = [];
      let startTime = Date.now();
      const interval = setInterval(() => {
        if (Date.now() - startTime < timeout) {
          return;
        }
        clearInterval(interval);
        this.serialDataHandler = this.fallbackSerialDataHandler;
        resolve(response.join(""));
      }, delay);

      try {
        this.connection.send(command);
      }
      catch (e) {
        reject(e);
      }

      this.serialDataHandler = (data: Buffer) => {
        startTime = Date.now();
        const text = data.toString();
        response.push(text);
      };
    });
  }

  close() {
    this.connection.end();
  }
}