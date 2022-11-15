import prompts from 'prompts';
import stringWidth from 'string-width';
import chalk, { ChalkInstance } from 'chalk';
import { Telnet } from 'telnet-client';
import { exit } from 'process';
import { SerialPort } from 'serialport';
import { createServer } from 'tftp'
import selectFolder from 'win-select-folder'

async function createTftpServer() {
  if (process.platform === 'win32') {
    const root = 'myComputer'; // rootfolder - default desktop
    const description = 'some description'; // default Select Folder
    const newFolderButton = 0; // whether or not to show the newFolderButton - default 1

    const result = await selectFolder({ root, description, newFolderButton });
  }
  const server = createServer({
    host: "0.0.0.0",
    port: 69,
    root: "/",
    denyPUT: true
  });
}

async function getSerialPortList(): Promise<string[]> {
  return (await SerialPort.list()).map(item => item.path);
}

async function telnetCommand(command: string) {

  const connection = new Telnet()

  const params = {
    port: 23,
    host: 'telehack.com',
    shellPrompt: '\\.',
    ors: '\r\n',
    timeout: 3000,
    execTimeout: 3000
  }

  try {
    await connection.connect(params)
  } catch (error) {
    // handle the throw (timeout)
  }

  const res = await connection.exec(command)
  console.log(res);
}

function generateHeader(header: string): string {
  const length = stringWidth(header);
  const width = length > 36 ? length + 4 : 40;
  const padLeft = (width - 2 - length) % 2 === 0 ? (width - 2 - length) / 2 : (width - 2 - length - 1) / 2;
  const padRight = (width - 2 - length) % 2 === 0 ? (width - 2 - length) / 2 : (width - 2 - length + 1) / 2;
  return `${'='.repeat(40)}\n*${' '.repeat(padLeft)}${header}${' '.repeat(padRight)}*\n${'='.repeat(40)}`;
}

async function printPage<T extends string = string>(header: string, message?: string | ChalkInstance, questions?: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>, options?: prompts.Options) {
  const log = console.log;
  console.clear();
  log(chalk.green(generateHeader(header)));
  if (message) {
    log(message);
  }
  if (questions) {
    const result = await prompts(questions, options);
    return result;
  }
  return null;
}
async function start() {
  await printPage('欢迎使用交换机快速配置工具', '', [{
    type: 'select',
    name: 'type',
    message: '请选择交换机型号：',
    choices: [
      { title: '华为s5700系列交换机', value: 's5700' },
      { title: '华为s5720系列交换机', value: 's5720' },
      { title: '其他品牌交换机', value: 'other' }
    ],
    hint: '请使用方向键进行选择，回车键确认。',
    initial: 0
  }, {
    type: 'select',
    name: 'method',
    message: '请选择连接方式：',
    choices: [
      { title: '串口Command', value: 'serial' },
      { title: '以太网口Command', value: 'ethernet' },
      { title: 'Telnet', value: 'telnet' },
      { title: '其他方式', value: 'other' }
    ],
    hint: '请使用方向键进行选择，回车键确认。',
    initial: 0
  }, {
    type: 'text',
    name: 'target',
    message: '请输入通信地址：',
    validate: value => value.length === 0 ? '必须输入通信地址' : true
  }, {
    type: 'text',
    name: 'user',
    message: '请输入用户名：',
    initial: 'admin',
    validate: value => value.length === 0 ? '必须输入用户名' : true
  }, {
    type: 'password',
    name: 'password',
    message: '请输入登录密码：'
  }]);

  await printPage('欢迎使用交换机快速配置工具', '', {
    type: 'select',
    name: 'type',
    message: '请选择需要执行的功能：',
    choices: [
      { title: '修改交换机名称', value: '1' },
      { title: '划分VLAN和网口', value: '2' },
      { title: '设置Telnet功能', value: '3' },
      { title: '设置SNMPV2功能', value: '4' },
      { title: '设置SNMPV3功能', value: '5' },
      { title: '使用其他相关设置功能', value: '6' },
      { title: '查看、备份或恢复交换机配置', value: '7' },
      { title: '使用交换机状态监视工具', value: '8' },
      { title: '使用关键性设置功能', value: '9' },
      { title: '返回初始设置界面', value: '0' }
    ],
    hint: '请使用方向键进行选择，回车键确认。',
    initial: 0
  });

  await printPage('欢迎使用交换机快速配置工具', chalk.red('注意！以下操作可能对交换机工作产生严重影响，请谨慎操作！'), {
    type: 'select',
    name: 'type',
    message: '请选择需要执行的功能：',
    choices: [
      { title: '重启交换机', value: '1' },
      { title: '修改用户登录密码', value: '2' },
      { title: '重置所有用户自定义设置', value: '3' },
      { title: '恢复到出厂设置', value: '4' },
      { title: '返回上一设置界面', value: '0' }
    ],
    hint: '请使用方向键进行选择，回车键确认。',
    initial: 0
  });

  await printPage('消息提示', '对不起，现在不支持任何交换机!', {
    type: 'confirm',
    name: 'value',
    message: '是否退出程序？',
    initial: true
  });

  await createTftpServer();

  //await telnetCommand('cal');

  exit(0);
}

start();