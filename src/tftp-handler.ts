import { createServer } from 'tftp'
import selectFolder from 'win-select-folder'

const createTftpServer = async (target:string, location:string) => {
  let path = '';
  if (process.platform === 'win32') {
    const root = 'myComputer';
    const description = '请选择文件保存位置';
    const newFolderButton = 1;

    path = await selectFolder({ root, description, newFolderButton });
  }
  const server = createServer({
    host: "0.0.0.0",
    port: 8069,
    root: path,
    denyPUT: false
  });

  await waitFilePut(server);
}

const waitFilePut = async (server: Server) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000000);
    server.listen();
    server.on("error", (error: TftpError) => {
      console.error(error);
      reject(error);
    });

    server.on("request", (req: GetStream, res: PutStream) => {
      console.log(req);
      req.on("error", function (error: Error) {
        //Error from the request
        //The connection is already closed
        console.error("[" + req.stats.remoteAddress + ":" + req.stats.remotePort +
          "] (" + req.file + ") " + error.message);
      });
    });
  });
}

const getRemoteFile = (target:string, location:string) => {
  createTftpServer(target, location);
}

export { getRemoteFile };