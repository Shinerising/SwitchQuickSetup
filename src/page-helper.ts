import fs from "fs";
import path from "path";
import prompts from "prompts";
import chalk from "chalk";
import AES from "crypto-js/aes";
import enc from "crypto-js/enc-utf8";
import { __dirname } from "./util";
import { print, clear, generateHeader } from "./util";
import { ClientConfig } from "./client-manager";

const options: prompts.Options = {
  onCancel: (prompt, answers) => {
    Object.keys(answers).forEach((index) => delete answers[index]);
    return false;
  }
};

export const printPage = async <T extends string>(header?: string, message?: string, questions?: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>) => {
  if (header) {
    clear();
    print(chalk.green(generateHeader(header)));
  }
  if (message) {
    print(message);
  }
  if (questions) {
    const result = await prompts(questions, options);
    if (Object.keys(result).length === 0) {
      return null;
    }
    return result;
  }
  return null;
};

export const converListToQuestions = <T extends string>(name: T, list: { title: string, value: unknown }[]): prompts.PromptObject<T> => {
  return {
    type: "select",
    name: name,
    message: "请选择需要执行的功能：",
    choices: list,
    hint: "请使用方向键进行选择，回车键确认。"
  } as prompts.PromptObject<T>;
};

const secret = "MIICXQIBAAKBgQDC";
const configFile = "switch.conf";

const loadConfigFile = () => {
  const filename = path.join(__dirname, configFile);
  try {
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(path.join(__dirname, configFile)).toString();
      const decrypted = AES.decrypt(data, secret);
      const config = JSON.parse(decrypted.toString(enc)) as ClientConfig;
      return config;
    }
  }
  catch {
    return null;
  }
  return null;
};

export const saveConfigFile = (config: ClientConfig) => {
  const filename = path.join(__dirname, configFile);
  try {
    const encrypted = AES.encrypt(JSON.stringify(config), secret);
    fs.writeFileSync(filename, encrypted.toString(), {});
  }
  catch {
    return;
  }
};

export const getLoginConfig = async (serialList: string[]): Promise<ClientConfig | null> => {
  const savedConfig = loadConfigFile();

  if (savedConfig) {
    const result = await printPage("欢迎使用交换机快速配置工具", "", {
      type: "confirm",
      name: "value",
      message: "是否采用上一次登录信息？",
      initial: true
    });
    if (result?.value) {
      return savedConfig;
    }
  }

  const result = await printPage("欢迎使用交换机快速配置工具", "", [{
    type: "select",
    name: "model",
    message: "请选择交换机型号：",
    choices: [
      { title: "华为s5700系列交换机", value: "s5700" },
      { title: "华为s5720系列交换机", value: "s5720" },
      { title: "其他品牌交换机", value: "other" }
    ],
    hint: "请使用方向键进行选择，回车键确认。",
    initial: 0
  }, {
    type: "select",
    name: "method",
    message: "请选择连接方式：",
    choices: [
      { title: "串口Command", value: "serial" },
      { title: "以太网口Command", value: "ethernet", disabled: true },
      { title: "Telnet", value: "telnet" },
      { title: "其他方式", value: "other" }
    ],
    hint: "请使用方向键进行选择，回车键确认。",
    initial: 0
  }, {
    type: method => method === "serial" ? "autocomplete" : "text",
    name: "target",
    message: "请输入通信地址：",
    choices: () => serialList.map(item => ({ title: item, value: item })),
    validate: value => value.length === 0 ? "必须输入通信地址" : true
  }, {
    type: "confirm",
    name: "login",
    message: "是否需要密码登录？",
    initial: true
  }, {
    type: (_prev, result) => result.login ? "text" : null,
    name: "user",
    message: "请输入用户名：",
    initial: "admin",
    validate: value => value.length < 1 || value.length > 16 ? "字符长度必须在1~16之间" : true
  }, {
    type: (_prev, result) => result.login ? "password" : null,
    name: "password",
    message: "请输入登录密码：",
    validate: value => value.length < 1 || value.length > 16 ? "密码长度必须在1~16之间" : true
  }, {
    type: (_prev, result) => result.password === ClientConfig.defaultPassword ? "password" : null,
    name: "passwordNew",
    message: "您输入的是系统默认密码，请输入新的密码：",
    validate: value => value.length < 1 || value.length > 16 ? "密码长度必须在1~16之间" : true
  }, {
    type: (_prev, result) => result.password === ClientConfig.defaultPassword ? "password" : null,
    name: "passwordNew2",
    message: "请再次输入新的密码：",
    validate: value => value.length < 1 || value.length > 16 ? "密码长度必须在1~16之间" : true
  }]);

  if (!result) {
    print(chalk.red(""));
    return null;
  }

  if (result.password === ClientConfig.defaultPassword && result.passwordNew !== result.passwordNew2) {
    print(chalk.red("两次输入的密码不相同！"));
    return null;
  }

  return result as ClientConfig;
};

export const confirmQuit = async () => {
  const result = await printPage("消息提示", "是否确定退出本程序？", {
    type: "confirm",
    name: "value",
    message: "是否退出程序？",
    initial: true
  });
  if (result) {
    return !!result.value;
  }
  return true;
};