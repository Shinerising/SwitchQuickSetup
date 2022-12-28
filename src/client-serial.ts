import { Client } from "./client-manager"

export class SerialClient implements Client {
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