import { createServer } from "tftp";

let server: Server;

const startServer = async (location: string) => {
  const path = location;
  server = createServer({
    host: "0.0.0.0",
    port: 8069,
    root: path,
    denyPUT: false
  });
  server.listen();
};

const stopServer = () => {
  server?.close();
};

const waitForPut = async (wait: number): Promise<string | null> => {
  return new Promise<string | null>((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve(null);
    }, wait);

    server.on("error", (error: Error) => {
      clearTimeout(timeout);
      reject(error);
    });

    server.on("request", (req: GetStream) => {
      req.on("end", () => {
        clearTimeout(timeout);
        resolve(req.file);
      });
      req.on("abort", () => {
        reject(new Error("文件传输被强制终止"));
      });
      req.on("error", (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  });
};

const waitForGet = async (wait: number): Promise<string | null> => {
  return new Promise<string | null>((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve(null);
    }, wait);

    server.on("error", (error: Error) => {
      clearTimeout(timeout);
      reject(error);
    });

    server.on("request", (req: GetStream, res: PutStream) => {
      res.on("finish", () => {
        clearTimeout(timeout);
        resolve(req.file);
      });
      res.on("abort", () => {
        reject(new Error("文件传输被强制终止"));
      });
      res.on("error", (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  });
};


export { startServer, stopServer, waitForPut, waitForGet };