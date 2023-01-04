import * as CommandCollection from "./command-collection";
import { Command, ConsoleCommand } from "./command-collection";

declare type BasicPage = {
  title: string,
  alert?: string,
  info?: string,
}
declare type ListPage = BasicPage & {
  list: Page[],
}
declare type CommandPage = BasicPage & {
  command?: ConsoleCommand | Command<string>,
}
declare type Page = ListPage | CommandPage;

const pageRoot: Page = {
  title: "欢迎使用交换机快速配置工具",
  list:
    [
      { title: "刷新当前页面", command: "back" },
      { title: "修改交换机名称", command: CommandCollection.nameChangeCommand },
      { title: "划分VLAN和网口", list:
          [
            { title: "设置VLAN", command: CommandCollection.vlanEnableCommand },
            { title: "取消设置VLAN", command: CommandCollection.vlanDisableCommand },
            { title: "划分网口归属", command: CommandCollection.portSetupCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      {
        title: "设置Telnet功能", list:
          [
            { title: "启用Telnet功能", command: CommandCollection.telnetEnableCommand },
            { title: "禁用Telnet功能", command: CommandCollection.telnetDisableCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      { title: "设置SNMP功能", },
      {
        title: "使用网络优化设置功能", list:
          [
            { title: "修改ARP表老化时间", command: CommandCollection.arpConfigCommand },
            { title: "关闭ARP严格学习功能", command: CommandCollection.arpStrictLearningDisableCommand },
            { title: "打开ARP严格学习功能", command: CommandCollection.arpStrictLearningEnableCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      {
        title: "查看、备份或恢复交换机配置", list:
          [
            { title: "查看当前交换机配置", command: CommandCollection.configPreviewCommand },
            { title: "备份当前交换机配置", command: CommandCollection.configBackupCommand },
            { title: "还原当前交换机配置", command: CommandCollection.configRestoreCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      {
        title: "使用交换机状态监视工具", list:
          [
            { title: "查看VLAN设置信息", command: CommandCollection.previewVlanCommand },
            { title: "查看接口基本信息", command: CommandCollection.previewInterfaceCommand },
            { title: "查看已连接的交换机设备", command: CommandCollection.previewDeviceCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      {
        title: "使用关键性设置功能", alert: "注意！以下操作可能对交换机工作产生严重影响，请谨慎操作！", list:
          [
            { title: "重启交换机", },
            { title: "修改用户登录密码", },
            { title: "重置所有用户自定义设置", },
            { title: "恢复到出厂设置", },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      { title: "退出设置", alert: "您即将退出本程序！", command: "quit" }
    ]
};

export { Page, ListPage, CommandPage, pageRoot };