import path from "path";
import { fileURLToPath } from "url";
import { SerialPort } from "serialport";
import { networkInterfaces } from "os";

const getSerialPortList = async () => {
  return (await SerialPort.list()).map(item => item.path);
}

const getInterfaceList = () => {
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4
      if (net.family === familyV4Value && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __isWindows = process.platform === "win32";

export { getSerialPortList, getInterfaceList, __filename, __dirname, __isWindows };