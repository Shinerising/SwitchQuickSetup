import fs from "fs";
import path from "path";
import Format from "string-format";
import prompts from "prompts";
import { __dirname, __isWindows, getInterfaceList } from "./util";
import { startServer, stopServer, waitForGet, waitForPut } from "./tftp-handler";
import selectFolder from "win-select-folder";

export type ConsoleCommand = "quit" | "back" | "refresh";

export type CommandSelector = { model: "default" | string, command: string };
export class Command<T extends string> {
  public description: string;
  public questions?: Array<prompts.PromptObject<T>>;
  public beforeExecute?: (result: prompts.Answers<T>, state?: unknown[]) => Promise<string | void>;
  public afterExecute?: (result: prompts.Answers<T>, state?: unknown[]) => Promise<string | void>;
  private command: string | null;
  private commandList: CommandSelector[] | null;
  public apply<T>(args?: T, model?: string): string {
    if (model && this.commandList) {
      const command = this.commandList.find(item => item.model)?.command || this.command || "";
      return args ? Format(command, args as object) : command;
    } else if (this.command) {
      const command = this.command;
      return args ? Format(command, args as object) : command;
    } else {
      return "";
    }
  }
  constructor(command: string | { model: string, command: string }[], description: string, questions?: Array<prompts.PromptObject<T>>, beforeExecute?: (result: prompts.Answers<T>, state?: unknown[]) => Promise<string | void>, afterExecute?: (result: prompts.Answers<T>, state?: unknown[]) => Promise<string | void>) {
    if (typeof command === "string") {
      this.commandList = null;
      this.command = command.trim();
    } else {
      this.commandList = command;
      this.command = command.find(item => item.model === "default")?.command || null;
    }
    this.description = description;
    this.questions = questions;
    this.beforeExecute = beforeExecute;
    this.afterExecute = afterExecute;
  }
}

export const nameChangeCommand = new Command(`
system-view
sysname {name}
quit
`, "修改设备名称", [{
  type: "text",
  name: "name",
  message: "请输入设备名称：",
  initial: "SWA",
  validate: value => value.length < 1 || value.length > 16 ? "字符长度必须在1~16之间" : true
}]);

export const vlanEnableCommand = new Command(`
system-view
vlan {vlan}
quit
interface vlan {vlan}
ip address {ip} {mask}
quit
`, "设置VLAN相关IP地址", [{
  type: "number",
  name: "vlan",
  message: "请输入VLAN号：",
  initial: "1",
  validate: value => value < 0 || value > 1000 ? "数值必须在1~1000之间" : true
}, {
  type: "text",
  name: "ip",
  message: "请输入IP地址：",
  initial: "172.16.34.1",
  validate: value => !new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/).test(value) ? "请输入正确的IP地址" : true
}, {
  type: "text",
  name: "mask",
  message: "请输入子网掩码：",
  initial: "255.255.255.0",
  validate: value => !new RegExp(/^((128|192)|2(24|4[08]|5[245]))(\.(0|(128|192)|2((24)|(4[08])|(5[245])))){3}$/).test(value) ? "请输入正确的子网掩码" : true
}]);

export const vlanDisableCommand = new Command(`
system-view
interface vlan {vlan}
undo ip address {ip} {mask}
quit
`, "取消设置VLAN相关IP地址", [{
  type: "number",
  name: "vlan",
  message: "请输入VLAN号：",
  initial: "1",
  validate: value => value < 0 || value > 1000 ? "数值必须在1~1000之间" : true
}, {
  type: "text",
  name: "ip",
  message: "请输入IP地址：",
  initial: "172.16.34.1",
  validate: value => !new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/).test(value) ? "请输入正确的IP地址" : true
}, {
  type: "text",
  name: "mask",
  message: "请输入子网掩码：",
  initial: "255.255.255.0",
  validate: value => !new RegExp(/^((128|192)|2(24|4[08]|5[245]))(\.(0|(128|192)|2((24)|(4[08])|(5[245])))){3}$/).test(value) ? "请输入正确的子网掩码" : true
}]);

export const portSetupCommand = new Command(`
system-view
port-group {group}
group-member GigabitEthernet {start} to GigabitEthernet {end}
port link-type access
port default vlan {vlan}
quit
`, "设置网口所属VLAN", [{
  type: "number",
  name: "vlan",
  message: "请输入VLAN号：",
  initial: "1",
  validate: value => value < 0 || value > 1000 ? "数值必须在1~1000之间" : true
}, {
  type: "number",
  name: "group",
  message: "请输入网口组编号：",
  initial: "1",
  validate: value => value < 0 || value > 1000 ? "数值必须在1~1000之间" : true
}, {
  type: "text",
  name: "start",
  message: "请输入起始网口：",
  initial: "0/0/1",
  validate: value => !new RegExp(/^((\d{1,2})(\/(?!$)|$)){3}$/).test(value) ? "请输入正确的网口编号" : true
}, {
  type: "text",
  name: "end",
  message: "请输入终止网口：",
  initial: "0/0/10",
  validate: value => !new RegExp(/^((\d{1,2})(\/(?!$)|$)){3}$/).test(value) ? "请输入正确的网口编号" : true
}]);


export const portXSetupCommand = new Command(`
system-view
port-group {group}
group-member XGigabitEthernet {start} to XGigabitEthernet {end}
port link-type access
port default vlan {vlan}
quit
`, "设置网口所属VLAN", [{
  type: "number",
  name: "vlan",
  message: "请输入VLAN号：",
  initial: "1",
  validate: value => value < 0 || value > 1000 ? "数值必须在1~1000之间" : true
}, {
  type: "number",
  name: "group",
  message: "请输入网口组编号：",
  initial: "1",
  validate: value => value < 0 || value > 1000 ? "数值必须在1~1000之间" : true
}, {
  type: "text",
  name: "start",
  message: "请输入起始网口：",
  initial: "0/0/1",
  validate: value => !new RegExp(/^((\d{1,2})(\/(?!$)|$)){3}$/).test(value) ? "请输入正确的网口编号" : true
}, {
  type: "text",
  name: "end",
  message: "请输入终止网口：",
  initial: "0/0/10",
  validate: value => !new RegExp(/^((\d{1,2})(\/(?!$)|$)){3}$/).test(value) ? "请输入正确的网口编号" : true
}]);

export const telnetAdminEnableCommand = new Command(`
system-view
telnet server enable
user-interface vty 0 4
protocol inbound telnet
authentication-mode aaa
quit
aaa
local-user admin service-type telnet terminal
local-user admin privilege level 15
quit
quit
`, "启用Telnet功能");

export const telnetEnableCommand = new Command(`
system-view
telnet server enable
user-interface vty 0 4
protocol inbound telnet
authentication-mode aaa
quit
aaa
local-user {user} service-type telnet
local-user {user} password irreversible-cipher {password}
{passwordOld}
local-user {user} privilege level 15
quit
quit
`, "启用Telnet功能（新用户）", [{
  type: "text",
  name: "user",
  message: "请输入用户名：",
  initial: "admin",
  validate: value => value.length < 1 || value.length > 16 ? "字符长度必须在1~16之间" : true
}, {
  type: "password",
  name: "password",
  message: "请输入新的Telnet密码：",
  validate: value => value.length < 1 || value.length > 16 ? "密码长度必须在1~16之间" : true
}, {
  type: "password",
  name: "passwordOld",
  message: "请输入旧的Telnet密码：",
  validate: value => value.length < 1 || value.length > 16 ? "密码长度必须在1~16之间" : true
}]);

export const telnetDisableCommand = new Command(`
system-view
telnet server disable
Y
quit
`, "禁用Telnet功能");

export const arpConfigCommand = new Command(`
system-view
arp expire-time {expireTime}
arp detect-times {detectTimes}
quit
`, "修改ARP表老化时间", [{
  type: "number",
  name: "expireTime",
  message: "请输入过期时间：",
  initial: 60,
  max: 600,
  min: 0,
  increment: 10,
  validate: value => value < 0 || value > 600 ? "数值必须在0~600之间" : true
}, {
  type: "number",
  name: "detectTimes",
  message: "请输入检测次数：",
  initial: 3,
  max: 10,
  min: 1,
  validate: value => value < 0 || value > 10 ? "数值必须在0~10之间" : true
}]);

export const arpStrictLearningEnableCommand = new Command(`
system-view
arp learning strict
quit
`, "启用ARP表严格学习功能");

export const arpStrictLearningDisableCommand = new Command(`
system-view
undo arp learning strict
quit
`, "禁用ARP表严格学习功能");

export const screenLengthSetCommand = new Command(`
system-view
user-interface console 0
screen-length {count}
quit
quit
`, "设置终端命令输出行数", [{
  type: "number",
  name: "count",
  message: "请输入输出行数(0为全部显示)：",
  initial: 0,
  max: 1024,
  min: 0,
  validate: value => value < 0 || value > 1024 ? "数值必须在0~1024之间" : true
}]);

export const configPreviewCommand = new Command(`
display current-configuration
`, "查看交换机当前配置文件");

export const configSaveCommand = new Command(`
save all {file}
Y
`, "保存交换机当前配置文件", [{
  type: "text",
  name: "file",
  message: "请输入配置文件名：",
  initial: "vrpcfg.zip",
  validate: value => value.length < 1 || value.length > 32 ? "字符长度必须在1~32之间" : true
}]);

export const configBackupCommand = new Command(`
tftp {ip} put {file}
`, "备份交换机配置文件", [{
  type: "text",
  name: "file",
  message: "请输入配置文件名：",
  initial: "vrpcfg.zip",
  validate: value => value.length < 1 || value.length > 32 ? "字符长度必须在1~32之间" : true
}, {
  type: "autocomplete",
  name: "ip",
  message: "请输入本机IP地址",
  initial: () => getInterfaceList()[0] || "0.0.0.0",
  choices: () => getInterfaceList()?.map(item => ({ title: item })) || [],
  validate: value => !new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/).test(value) ? "请输入正确的IP地址" : true
}, {
  type: "autocomplete",
  name: "folder",
  message: "请输入配置文件保存位置",
  initial: () => __dirname,
  choices: () => __isWindows ? [{ title: __dirname }, { title: "使用文件对话框选择", value: "0" }] : [{ title: __dirname }],
  validate: value => value !== "0" && !fs.existsSync(value) ? "请输入合法的文件保存位置" : true
}], async (result: prompts.Answers<"ip" | "folder"> | null, state?: unknown[]) => {
  if (!result) {
    return;
  }
  if (__isWindows && result.folder === "0") {
    const root = "myComputer";
    const description = "请选择文件保存位置";
    const newFolderButton = 1;
    const path = await selectFolder({ root, description, newFolderButton });
    result.folder = path;
  }
  if (!fs.existsSync(result.folder)) {
    throw new Error("文件夹不存在！");
  }
  startServer(result.folder);

  (async () => {
    const file = await waitForPut(20000);
    state?.push(file);
  })();

  return "目标文件夹存在：" + result.folder;
}, async (result: prompts.Answers<"ip" | "folder"> | null, state?: unknown[]) => {
  if (!result) {
    return;
  }

  stopServer();

  const file = state?.pop();
  if (!file) {
    throw new Error("未能成功收取到文件！");
  } else {
    return "已成功收取到文件：" + file;
  }
});

export const configRestoreCommand = new Command(`
tftp {ip} get {file}
`, "还原交换机配置文件", [{
  type: "text",
  name: "file",
  message: "请输入配置文件名：",
  initial: "vrpcfg.zip",
  validate: value => value.length < 1 || value.length > 32 ? "字符长度必须在1~32之间" : true
}, {
  type: "autocomplete",
  name: "ip",
  message: "请输入本机IP地址",
  initial: () => getInterfaceList()[0] || "0.0.0.0",
  choices: () => getInterfaceList()?.map(item => ({ title: item })) || [],
  validate: value => !new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/).test(value) ? "请输入正确的IP地址" : true
}, {
  type: "autocomplete",
  name: "folder",
  message: "请输入配置文件保存位置",
  initial: () => __dirname,
  choices: () => __isWindows ? [{ title: __dirname }, { title: "使用文件对话框选择", value: "0" }] : [{ title: __dirname }],
  validate: value => value !== "0" && !fs.existsSync(value) ? "请输入合法的文件保存位置" : true
}], async (result: prompts.Answers<"ip" | "folder"> | null, state?: unknown[]) => {
  if (!result) {
    return;
  }

  if (__isWindows && result.folder === "0") {
    const root = "myComputer";
    const description = "请选择文件保存位置";
    const newFolderButton = 1;
    const path = await selectFolder({ root, description, newFolderButton });
    result.folder = path;
  }
  if (!fs.existsSync(result.folder)) {
    throw new Error("文件夹不存在！");
  } else if (!fs.existsSync(path.join(result.folder, "vrpcfg.zip"))) {
    throw new Error("配置文件不存在！");
  }

  (async () => {
    const file = await waitForGet(20000);
    state?.push(file);
  })();

  return "目标文件夹存在：" + result.folder;
}, async (result: prompts.Answers<"ip" | "folder"> | null, state?: unknown[]) => {
  if (!result) {
    return;
  }

  stopServer();

  const file = state?.pop();
  if (!file) {
    throw new Error("未能成功发送文件！");
  } else {
    return "已成功发送文件：" + file;
  }
});

export const configStartupCommand = new Command(`
startup saved-configuration {file}
`, "应用交换机当前配置文件", [{
  type: "text",
  name: "file",
  message: "请输入配置文件名：",
  initial: "vrpcfg.zip",
  validate: value => value.length < 1 || value.length > 32 ? "字符长度必须在1~32之间" : true
}]);

export const snmpEnableV2Command = new Command(`
system-view
snmp-agent
snmp-agent sys-info version v2c
snmp-agent protocol source-interface Vlanif {vlan}
snmp-agent community complexity-check disable
snmp-agent community read {name}
snmp-agent community write {name}
quit
`, "启用SNMPv2c功能", [{
  type: "text",
  name: "vlan",
  message: "请输入允许接入的VLAN编号：",
  initial: "1",
  validate: value => value.length < 1 || value.length > 32 ? "字符长度必须在1~32之间" : true
},{
  type: "text",
  name: "name",
  message: "请输入Community名称",
  initial: "SNMP_1989",
  validate: value => value.length < 1 || value.length > 32 ? "字符长度必须在1~32之间" : true
}]);

export const snmpDisableV2Command = new Command(`
system-view
undo snmp-agent
undo snmp-agent protocol source-interface Vlanif {vlan}
undo snmp-agent community read {name}
undo snmp-agent community write {name}
quit
`, "禁用SNMPv2c功能", [{
  type: "text",
  name: "vlan",
  message: "请输入允许接入的VLAN编号：",
  initial: "1",
  validate: value => value.length < 1 || value.length > 32 ? "字符长度必须在1~32之间" : true
},{
  type: "text",
  name: "name",
  message: "请输入Community名称",
  initial: "SNMP_1989",
  validate: value => value.length < 1 || value.length > 32 ? "字符长度必须在1~32之间" : true
}]);

export const systemRebootCommand = new Command(`
reboot fast
Y
`, "重启交换机", [{
  type: "confirm",
  name: "value",
  message: "是否确定重启交换机？",
  initial: true
}]);

export const systemPasswordCommand = new Command(`
system-view
aaa
local-user admin password irreversible-cipher {newPassword}
{oldPassword}
`, "修改管理员密码", [{
  type: "password",
  name: "oldPassword",
  message: "请输入旧登录密码：",
  validate: value => value.length < 1 || value.length > 16 ? "密码长度必须在1~16之间" : true
},{
  type: "password",
  name: "newPassword",
  message: "请输入新登录密码：",
  validate: value => value.length < 1 || value.length > 16 ? "密码长度必须在1~16之间" : true
}, {
  type: "password",
  name: "newPasswordRepeat",
  message: "请再次输入登录密码：",
  validate: value => value.length < 1 || value.length > 16 ? "密码长度必须在1~16之间" : true
}]);

export const systemResetCommand = new Command(`
reset saved-configuration
Y
reboot fast
N
Y
`, "清空交换机配置", [{
  type: "confirm",
  name: "value",
  message: "是否确定清空交换机配置？",
  initial: true
}]);

export const systemFactoryCommand = new Command(`
reset factory-configuration
`, "恢复出厂配置", [{
  type: "confirm",
  name: "value",
  message: "是否确定恢复出厂配置？",
  initial: true
}]);

export const previewVlanCommand = new Command(`
display vlan
`, "查看VLAN配置状态");

export const previewInterfaceCommand = new Command(`
display interface brief
`, "查看接口基本信息");

export const previewDeviceCommand = new Command(`
display device
`, "查看已连接的交换机设备");

export const previewTelnetCommand = new Command(`
display telnet server status
`, "查看Telnet通信状态");

export const previewUsersCommand = new Command(`
display users all
`, "查看所有用户登录状态");

export const previewStartupCommand = new Command(`
display startup
`, "查看系统启动参数");