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
  command: ConsoleCommand | Command<string>,
}
declare type Page = ListPage | CommandPage;

const pageRoot: Page = {
  title: "欢迎使用交换机快速配置工具",
  list:
    [
      { title: "刷新当前页面", command: "refresh" },
      { title: "修改交换机名称", command: CommandCollection.nameChangeCommand },
      {
        title: "划分VLAN和网口", list:
          [
            { title: "设置VLAN", command: CommandCollection.vlanEnableCommand },
            { title: "取消设置VLAN", command: CommandCollection.vlanDisableCommand },
            { title: "划分网口归属", command: CommandCollection.portSetupCommand },
            { title: "划分网口归属(万兆)", command: CommandCollection.portXSetupCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      {
        title: "设置Telnet功能", list:
          [
            { title: "启用Telnet功能", command: CommandCollection.telnetAdminEnableCommand },
            { title: "启用Telnet功能(新用户)", command: CommandCollection.telnetEnableCommand },
            { title: "禁用Telnet功能", command: CommandCollection.telnetDisableCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      {
        title: "设置SNMP功能", list:
        [
          { title: "启用SNMPv2c功能", command: CommandCollection.snmpEnableV2Command },
          { title: "禁用SNMPv2c功能", command: CommandCollection.snmpDisableV2Command },
          { title: "返回上一设置界面", command: "back" }
        ]
      },
      {
        title: "使用网络优化设置功能", list:
          [
            { title: "修改ARP表老化时间", command: CommandCollection.arpConfigCommand },
            { title: "关闭ARP严格学习功能", command: CommandCollection.arpStrictLearningDisableCommand },
            { title: "打开ARP严格学习功能", command: CommandCollection.arpStrictLearningEnableCommand },
            { title: "设置终端命令输出最大行数", command: CommandCollection.screenLengthSetCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      {
        title: "查看、备份或恢复交换机配置", alert: "备份交换机配置文件前请先执行保存指令！", list:
          [
            { title: "查看当前交换机配置", command: CommandCollection.configPreviewCommand },
            { title: "保存交换机配置", command: CommandCollection.configSaveCommand },
            { title: "备份交换机配置", command: CommandCollection.configBackupCommand },
            { title: "还原交换机配置", command: CommandCollection.configRestoreCommand },
            { title: "将交换机配置应用至启动", command: CommandCollection.configStartupCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      {
        title: "使用关键性设置功能", alert: "注意！以下操作可能对交换机工作产生严重影响，请谨慎操作！", list:
          [
            { title: "重启交换机", alert: "重启交换机会导致当前业务中断，重启时长可能长达5分钟以上，请确保不会对其他工作产生影响同时已保存所有配置文件！", command: CommandCollection.systemRebootCommand },
            { title: "修改管理员登录密码", alert: "修改交换机管理员密码可能会导致其他人员无法管理交换机，请牢记并妥善保管新设立的密码内容！", command: CommandCollection.systemPasswordCommand },
            { title: "重置所有用户自定义设置", alert: "重置自定义设置会删除所有用户配置项目并恢复到出厂默认值，请确定是否采取此操作！", command: CommandCollection.systemResetCommand },
            { title: "恢复到出厂模式", alert: "将交换机恢复至出厂模式将完全抹除交换机中所有文件和设置，请确定是否采取此操作！", command: CommandCollection.systemFactoryCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      {
        title: "使用交换机状态监视工具", list:
          [
            { title: "查看VLAN设置信息", command: CommandCollection.previewVlanCommand },
            { title: "查看接口基本信息", command: CommandCollection.previewInterfaceCommand },
            { title: "查看已连接的交换机设备", command: CommandCollection.previewDeviceCommand },
            { title: "查看Telnet通信状态", command: CommandCollection.previewTelnetCommand },
            { title: "查看所有用户登录状态", command: CommandCollection.previewUsersCommand },
            { title: "查看系统启动参数", command: CommandCollection.previewStartupCommand },
            { title: "返回上一设置界面", command: "back" }
          ]
      },
      { title: "退出设置", alert: "您即将退出本程序，请确认交换机设置是否已保存或备份！", command: "quit" }
    ]
};

export { Page, ListPage, CommandPage, pageRoot };