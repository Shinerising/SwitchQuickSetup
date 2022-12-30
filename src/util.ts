import path from "path";
import stringWidth from "string-width";
import { fileURLToPath } from "url";
import { SerialPort } from "serialport";
import { networkInterfaces } from "os";

const getSerialPortList = async () => {
  return (await SerialPort.list()).map(item => item.path);
};

const getInterfaceList = () => {
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __isWindows = process.platform === "win32";

export { getSerialPortList, getInterfaceList, __filename, __dirname, __isWindows };

// eslint-disable-next-line no-console
export const print = console.log;

// eslint-disable-next-line no-console
export const clear = console.clear;

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateHeader = (header: string): string => {
  const length = stringWidth(header);
  const width = length > 36 ? length + 4 : 40;
  const padLeft = (width - 2 - length) % 2 === 0 ? (width - 2 - length) / 2 : (width - 2 - length - 1) / 2;
  const padRight = (width - 2 - length) % 2 === 0 ? (width - 2 - length) / 2 : (width - 2 - length + 1) / 2;
  return `${"=".repeat(40)}\n*${" ".repeat(padLeft)}${header}${" ".repeat(padRight)}*\n${"=".repeat(40)}`;
};