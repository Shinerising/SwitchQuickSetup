import prompts from "prompts";
import chalk, { ChalkInstance } from "chalk";
import { exit } from "process";
import { getSerialPortList, getInterfaceList, print, clear, generateHeader } from "./util";
import { SwitchLoginConfig } from "./client-manager";

export class App {
  serialList: string[] = [];
  ipList: string[] = [];

  private async printPage<T extends string = string>(header?: string, message?: string | ChalkInstance, questions?: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>, options?: prompts.Options) {
    if (header) {
      clear();
      print(chalk.green(generateHeader(header)));
    }
    if (message) {
      print(message);
    }
    if (questions) {
      const result = await prompts(questions, options);
      return result;
    }
    return null;
  }
  public async getLoginConfig(): Promise<SwitchLoginConfig> {
    const result = await this.printPage("欢迎使用交换机快速配置工具", "", [{
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
      choices: () => this.serialList.map(item => ({ title: item, value: item })),
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
      message: "请输入登录密码："
    }]);

    const config = result as SwitchLoginConfig;

    if (result?.password === SwitchLoginConfig.defaultPassword) {
      const passwordResult = await this.printPage("", "您输入的是系统默认密码，请设置新密码", [{
        type: "password",
        name: "password0",
        message: "请输入新的密码："
      }, {
        type: "password",
        name: "password1",
        message: "请再次输入新的密码："
      }]);

      config.passwordNew = passwordResult?.password0;
    }

    return config;
  }

  public async start() {
    await this.printPage("欢迎使用交换机快速配置工具", "正在检查系统配置");
    this.serialList = await getSerialPortList();
    this.ipList = getInterfaceList();

    const loginConfig = await this.getLoginConfig();
    print(loginConfig);

    await this.printPage("欢迎使用交换机快速配置工具", "", {
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

    await this.printPage("欢迎使用交换机快速配置工具", chalk.red("注意！以下操作可能对交换机工作产生严重影响，请谨慎操作！"), {
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

    await this.printPage("消息提示", "对不起，现在不支持任何交换机!", {
      type: "confirm",
      name: "value",
      message: "是否退出程序？",
      initial: true
    });

    //await createTftpServer();

    //await telnetCommand('cal');

    exit(0);
  }
}
