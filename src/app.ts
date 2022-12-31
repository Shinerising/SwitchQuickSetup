import chalk from "chalk";
import { exit } from "process";
import { clientWrapper } from "./client-manager";
import { getLoginConfig } from "./initialize";
import { getSerialPortList, print } from "./util";
import { printPage } from "./page-helper";

export class App {

  public async start() {
    await printPage("欢迎使用交换机快速配置工具", "正在检查系统配置");
    const serialList = await getSerialPortList();

    const loginConfig = await getLoginConfig(serialList);
    if(!loginConfig){
      print(chalk.red("登录配置错误，程序即将退出！"));
      return exit(0);
    }
    clientWrapper.applyConfig(loginConfig);
    const brief = clientWrapper.getBrief();
    print(brief);
    const available = await clientWrapper.tryLogin();
    if (!available) {
      print(chalk.red("交换机无法登录，程序即将退出！"));
      return exit(0);
    }

    await printPage("欢迎使用交换机快速配置工具", "", {
      type: "select",
      name: "type",
      message: "请选择需要执行的功能：",
      choices: [
        { title: "修改交换机名称", value: 1 },
        { title: "划分VLAN和网口", value: 2 },
        { title: "设置Telnet功能", value: 3 },
        { title: "设置SNMPV2功能", value: 4 },
        { title: "设置SNMPV3功能", value: 5 },
        { title: "使用其他相关设置功能", value: 6 },
        { title: "查看、备份或恢复交换机配置", value: 7 },
        { title: "使用交换机状态监视工具", value: 8 },
        { title: "使用关键性设置功能", value: 9 },
        { title: "返回初始设置界面", value: 0 }
      ],
      hint: "请使用方向键进行选择，回车键确认。",
      initial: 0
    });

    await printPage("欢迎使用交换机快速配置工具", chalk.red("注意！以下操作可能对交换机工作产生严重影响，请谨慎操作！"), {
      type: "select",
      name: "type",
      message: "请选择需要执行的功能：",
      choices: [
        { title: "重启交换机", value: "1" },
        { title: "修改用户登录密码", value: "2" },
        { title: "重置所有用户自定义设置", value: "3" },
        { title: "恢复到出厂设置", value: "4" },
        { title: "返回上一设置界面", value: "0" }
      ],
      hint: "请使用方向键进行选择，回车键确认。",
      initial: 0
    });

    await printPage("消息提示", "对不起，现在不支持任何交换机!", {
      type: "confirm",
      name: "value",
      message: "是否退出程序？",
      initial: true
    });

    return exit(0);
  }
}
