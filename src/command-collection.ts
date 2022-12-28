import Format from "string-format";
import prompts from 'prompts';

export class Command<T extends string> {
  public description: string;
  public questions?: Array<prompts.PromptObject<T>>;
  private command: string;
  public apply<T>(args?: T): string {
    return args ? Format(this.command, args as object) : this.command;
  }
  constructor(command: string, description: string, questions?: Array<prompts.PromptObject<T>>) {
    this.command = command.trim();
    this.description = description;
    this.questions = questions;
  }
}

export const nameChangeCommand = new Command(`
sysname {name}
`, "修改设备名称", [{
  type: 'text',
  name: 'name',
  message: '请输入设备名称：',
  initial: 'SWA',
  validate: value => value.length < 1 || value.length > 16 ? '字符长度必须在1~16之间' : true
}]);

export const vlanEnableCommand = new Command(`
system-view
vlan {vlan}
quit
interface vlan {vlan}
ip address {ip} {mask}
quit
`, "设置VLAN相关IP地址", [{
  type: 'number',
  name: 'vlan',
  message: '请输入VLAN号：',
  initial: '1',
  validate: value => value < 0 || value > 1000 ? '数值必须在1~1000之间' : true
},{
  type: 'text',
  name: 'ip',
  message: '请输入IP地址：',
  initial: '172.16.34.1',
  validate: value => !new RegExp("^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(.(?!$)|$)){4}$").test(value) ? "请输入正确的IP地址" : true
},{
  type: 'text',
  name: 'mask',
  message: '请输入子网掩码：',
  initial: '255.255.255.0',
  validate: value => !new RegExp("^(((255.){3}(255|254|252|248|240|224|192|128|0+))|((255.){2}(255|254|252|248|240|224|192|128|0+).0)|((255.)(255|254|252|248|240|224|192|128|0+)(.0+){2})|((255|254|252|248|240|224|192|128|0+)(.0+){3}))$").test(value) ? "请输入正确的子网掩码" : true
}]);

export const vlanDisableCommand = new Command(`
system-view
interface vlan {vlan}
undo ip address {ip} {mask}
quit
`, "取消设置VLAN相关IP地址", [{
  type: 'number',
  name: 'vlan',
  message: '请输入VLAN号：',
  initial: '1',
  validate: value => value < 0 || value > 1000 ? '数值必须在1~1000之间' : true
},{
  type: 'text',
  name: 'ip',
  message: '请输入IP地址：',
  initial: '172.16.34.1',
  validate: value => !new RegExp("^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(.(?!$)|$)){4}$").test(value) ? "请输入正确的IP地址" : true
},{
  type: 'text',
  name: 'mask',
  message: '请输入子网掩码：',
  initial: '255.255.255.0',
  validate: value => !new RegExp("^(((255.){3}(255|254|252|248|240|224|192|128|0+))|((255.){2}(255|254|252|248|240|224|192|128|0+).0)|((255.)(255|254|252|248|240|224|192|128|0+)(.0+){2})|((255|254|252|248|240|224|192|128|0+)(.0+){3}))$").test(value) ? "请输入正确的子网掩码" : true
}]);

export const telnetEnableCommand = new Command(`
system-view
telnet server enable
user-interface vty 0 4
protocol inbound telnet
authentication-mode aaa
quit
aaa
local-user admin service-type telnet terminal
local-user admin password
local-user admin privilege level 15
quit
`, "");

export const arpConfigCommand = new Command(`
system-view
arp expire-time {expireTime}
arp detect-times {detectTimes}
`, "修改ARP表老化时间", [{
  type: 'number',
  name: 'expireTime',
  message: '请输入过期时间：',
  initial: 60,
  max: 600,
  min: 0,
  increment: 10,
  validate: value => value < 0 || value > 600 ? '数值必须在0~600之间' : true
}, {
  type: 'number',
  name: 'detectTimes',
  message: '请输入检测次数：',
  initial: 3,
  max: 10,
  min: 1,
  validate: value => value < 0 || value > 10 ? '数值必须在0~10之间' : true
}]);

export const arpStrictLearningEnableCommand = new Command(`
system-view
arp learning strict
`, "");

export const arpStrictLearningDisableCommand = new Command(`
system-view
undo arp learning strict
`, "");