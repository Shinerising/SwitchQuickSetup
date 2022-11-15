import prompts from 'prompts';
import stringWidth from 'string-width';
import chalk from 'chalk';

function generateHeader(header: string): string {
  const length = stringWidth(header);
  const width = length > 36 ? length + 4 : 40;
  const padLeft = (width - 2 - length) % 2 === 0 ? (width - 2 - length) / 2 : (width - 2 - length - 1) / 2;
  const padRight = (width - 2 - length) % 2 === 0 ? (width - 2 - length) / 2 : (width - 2 - length + 1) / 2;
  return `${'='.repeat(40)}\n*${' '.repeat(padLeft)}${header}${' '.repeat(padRight)}*\n${'='.repeat(40)}`;
}

async function printPage<T extends string = string>(header: string, message: string, questions: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>, options?: prompts.Options) {
  const log = console.log;
  console.clear();
  log(chalk.blue(generateHeader(header)));
  if (message && message.length > 0) {
    log(message);
  }
  const result = await prompts(questions, options);
  return result;
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
  }]);

  await printPage('消息提示', '对不起，现在不支持任何交换机!', {
    type: 'confirm',
    name: 'value',
    message: '是否退出程序？',
    initial: true
  });

}

start();