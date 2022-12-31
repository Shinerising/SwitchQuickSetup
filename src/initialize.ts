import chalk from "chalk";
import { printPage } from "./page-helper";
import { ClientConfig } from "./client-manager";
import { print } from "./util";

export const getLoginConfig = async (serialList: string[]): Promise<ClientConfig | null> => {
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
      { title: "以太网口Command", value: "ethernet" },
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
    type: "text",
    name: "user",
    message: "请输入用户名：",
    initial: "admin",
    validate: value => value.length === 0 ? "必须输入用户名" : true
  }, {
    type: "password",
    name: "password",
    message: "请输入登录密码：",
  }, {
    type: prev => prev === ClientConfig.defaultPassword ? "password" : null,
    name: "passwordNew",
    message: "您输入的是系统默认密码，请输入新的密码："
  }, {
    type: "password",
    name: "passwordNew2",
    message: "请再次输入新的密码："
  }]);

  if(!result){
    print(chalk.red(""));
    return null;
  }

  if (result.password === ClientConfig.defaultPassword && result.passwordNew !== result.passwordNew2) {
    print(chalk.red("两次输入的密码不相同！"));
    return null;
  }

  return result as ClientConfig;
};