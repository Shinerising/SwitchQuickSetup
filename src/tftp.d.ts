declare type TftpError = NodeJS.ErrnoException;
declare type TftpStats = {
  blockSize: number,
  windowSize: number,
  size: number,
  userExtensions: object,
  retries: number,
  timeout: number,
  localAddress: string,
  localPort: number,
  remoteAddress: string,
  remotePort: number
};
declare type ClientStream = {
  on(event: "about", callback: () => void): void,
  on(event: "close", callback: () => void): void,
  on(event: "end", callback: () => void): void,
  on(event: "error", callback: (error: TftpError) => void): void,
  on(event: "finish", callback: () => void): void,
  on(event: "stats", callback: (stats: TftpStats) => void): void,
  about(error?: TftpError): void,
  close(): void
};
declare type GetStream = ClientStream & {
  file: string,
  method: string,
  stats: TftpStats,
};
declare type PutStream = ClientStream & {
  setSize(size:number):void,
  setUserExtensions(userExtensions:object) : void
};
declare type ClientOption = {
  host?: string,
  port?: number,
  blockSize?: number,
  windowSize?: number,
  retries?: number,
  timeout?: number
}
declare type ServerOption = ClientOption & {
  root?: string,
  denyGet?: boolean,
  denyPUT?: boolean
}
declare type Client = {
  createGetStream(remoteFile: string, options: { md5: string, sha1: string, userExtensions: object }): ClientStream,
  createPutStream(remoteFile: string, options: { size: string, userExtensions: object }): ClientStream,
  get(remoteFile: string, localFile?: string, options?: { md5: string, sha1: string, userExtensions: object }, callback: (error: TftpError) => void): void,
  put(localFile: string, remoteFile?: string, options?: { md5: string, sha1: string, userExtensions: object }, callback: (error: TftpError) => void): void
}
declare type Server = {
  host: string,
  port: number,
  root: string,
  close(): void,
  listen(): void,
  requestListener(req, res): void,
  on(event: "close", callback: () => void): void,
  on(event: "error", callback: (error: TftpError) => void): void,
  on(event: "listening", callback: () => void): void,
  on(event: "request", callback: (req: GetStream, put: PutStream) => void): void
}
declare module "tftp" {
  export function createServer(options: ServerOption, requestListener?: (req, res) => void): Server;
  export function createClient(options: ClientOption): Client;
} 
