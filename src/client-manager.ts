import { TelnetClient } from "./client-telnet"

export class ClientWrapper {
  private client:Client;
  constructor(){
    this.client = new TelnetClient("telehack.com");
  }
  public async executeCommandList(commands:string[], sendText:(text:string) => void, receiveText:(text:string) => void){
    this.client.setReceive(receiveText);

    await this.client.start();
    await this.client.login();

    for(const command of commands){
      sendText(command);
      await this.executeCommand(command);
    }

    await this.client.close();
    
    this.client.clearReceive();
  }

  private async executeCommand(command:string){
    await this.client.execute(command);
  }
}

export interface Client {
  username:string;
  password:string;
  newpassword:string;
  start():Promise<void>;
  close():Promise<void>;
  login():Promise<void>;
  execute(command:string):Promise<void>;
  setReceive(receiveText:(text:string) => void):void;
  clearReceive():void;
}

class SerialClient implements Client{
  public username = "";
  public password = "";
  public newpassword = "";
  private receiveText?:(text:string) => void;

  public async start(): Promise<void> {
    console.log("start");
  }

  public async close(): Promise<void> {
    console.log("close");
  }

  public async login(): Promise<void> {
    console.log("login");
  }

  public async execute(command:string):Promise<void>{
    console.log(command);
  }

  public setReceive(receiveText:(text:string) => void):void{
    this.receiveText = receiveText;
  }

  public clearReceive(){
    this.receiveText = undefined;
  }
}

export const clientWrapper: ClientWrapper = new ClientWrapper();