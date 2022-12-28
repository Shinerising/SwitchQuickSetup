import { createServer } from 'tftp'
//import selectFolder from 'win-select-folder'

let server: Server;

const startServer = async (location: string) => {
  const path = location;
  /*
  if (process.platform === 'win32') {
    const root = 'myComputer';
    const description = '请选择文件保存位置';
    const newFolderButton = 1;

    path = await selectFolder({ root, description, newFolderButton });
  }
  */
  server = createServer({
    host: "0.0.0.0",
    port: 8069,
    root: path,
    denyPUT: false
  });
  server.listen();
}

const stopServer = () => {
  server?.close();
}

const waitForPut = async (wait: number): Promise<string | null> => {
  return new Promise<string | null>((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve(null);
    }, wait);
    server.on("error", (error: TftpError) => {
      clearTimeout(timeout);
      reject(error);
    });

    server.on("request", (req: GetStream) => {
      req.on("end", () => {
        clearTimeout(timeout);
        resolve(req.file);
      });
      req.on("error", (error: TftpError) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  });
}

export { startServer, stopServer, waitForPut };