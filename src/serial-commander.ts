import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { print } from "./util";

declare interface SerialCommanderOption {
  port: string;
  baudrate: number;
  readDelimiter: string;
  writeDelimiter: string;
  disableLog: boolean;
  defaultDelay: number;
  log: (text: string | string[]) => void;
}

export class SerialCommander {
  private port: SerialPort;
  private log: (text: string | string[]) => void;
  private isLogEnabled: boolean;
  private defaultDelay: number;
  private fallbackSerialDataHandler: (data: string) => void;
  private serialDataHandler: (data: string) => void;
  private writeDelimiter: string;
  private parser: ReadlineParser;
  constructor(option: SerialCommanderOption = {
    port: "/dev/modem",
    baudrate: 115200,
    readDelimiter: "\n",
    writeDelimiter: "\r\n",
    disableLog: false,
    defaultDelay: 100,
    log: string => print(`[${new Date().toISOString()}] ${string}`)
  }) {
    this.log = option.log;
    this.isLogEnabled = !option.disableLog;
    this.defaultDelay = option.defaultDelay;
    this.fallbackSerialDataHandler = (line: string) => this.log(`{answer given outside command scope} ${line}`);
    this.serialDataHandler = this.fallbackSerialDataHandler;
    this.writeDelimiter = option.writeDelimiter;

    this.port = new SerialPort({ path: option.port, baudRate: option.baudrate });
    this.parser = new ReadlineParser();
    this.port.pipe(this.parser);
    this.parser.on("data", (line: string) => this.serialDataHandler(line));
  }

  async send(command: string, {
    expectedResponses = ["OK"],
    timeout = 1000,
    delay = this.defaultDelay
  } = {}): Promise<string> {

    return new Promise((resolve) => {
      const response: string[] = [];
      let startTime = Date.now();
      const interval = setInterval(() => {
        if (Date.now() - startTime < timeout) {
          return;
        }
        clearInterval(interval);
        this.serialDataHandler = this.fallbackSerialDataHandler;
        resolve(response.join("\n").trim());
      }, delay);

      const escapedCommand = `${command}${this.writeDelimiter}`;
      this.port.write(escapedCommand);
      if (this.isLogEnabled) this.log(`>> ${command}`);

      this.serialDataHandler = (line: string | string[]) => {
        startTime = Date.now();
        if (typeof line === "string") {
          response.push(line);
        } else {
          response.concat(line);
        }

        const isCommandSuccessfullyTerminated = expectedResponses.some(
          expectedResponse => line.includes(expectedResponse)
        );
        if (isCommandSuccessfullyTerminated) {
          if (this.isLogEnabled) this.log(`<< ${line}`);

          this.serialDataHandler = this.fallbackSerialDataHandler;
          clearInterval(interval);

          resolve(response.join("\n").trim());
        } else {
          if (this.isLogEnabled) this.log(line);
        }
      };
    });
  }

  close() {
    if (this.port.isOpen) this.port.close();
  }
}