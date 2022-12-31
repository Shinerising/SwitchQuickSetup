import chalk from "chalk";
import { exit } from "process";
import { clientWrapper } from "./client-manager";
import { delay, getSerialPortList, print } from "./util";
import { Page, ListPage, CommandPage, pageRoot } from "./page-collection";
import { printPage, converListToQuestions, getLoginConfig, confirmQuit } from "./page-helper";
import { executeCommand } from "./command-manager";

/**
 * Main app
 */
export class App {
  private pageCurrent: Page;
  private pageStack: Page[];

  /**
   * constructor
   */
  constructor() {
    this.pageCurrent = pageRoot;
    this.pageStack = [];
  }

  /**
   * Initialize app config & try log in
   * @returns true if log in successfully
   */
  private async initialize() {
    await printPage("欢迎使用交换机快速配置工具", "正在检查系统配置");
    const serialList = await getSerialPortList();

    const loginConfig = await getLoginConfig(serialList);
    if (!loginConfig) {
      print(chalk.red("登录配置错误，程序即将退出！"));
      return false;
    }
    clientWrapper.applyConfig(loginConfig);
    const brief = clientWrapper.getBrief();
    await printPage("正在尝试登录交换机", brief);
    await delay(1000);
    const available = await clientWrapper.tryLogin();
    if (!available) {
      print(chalk.red("交换机无法登录，程序即将退出！"));
      return false;
    }
    pageRoot.info = clientWrapper.getInfo();
    return true;
  }

  /**
   * Show pages and submit commands
   */
  private async working() {
    let executeResult: void | boolean;

    this.pageCurrent = pageRoot;
    this.pageStack = [];

    do {
      executeResult = undefined;

      const page = this.pageCurrent;
      if ((page as ListPage).list) {
        const listPage = page as ListPage;
        if (listPage.list) {
          const title = listPage.title;
          const message = listPage.alert ? chalk.red(listPage.alert) : listPage.info;
          const questions = converListToQuestions("page", listPage.list.map(item => ({ title: item.title + ((item as ListPage).list ? "…" : ""), value: item })));
          const result = await printPage(title, message, questions);
          if (!result) {
            const page = this.pageStack.pop();
            if (!page) {
              executeResult = false;
            } else {
              this.pageCurrent = page;
              executeResult = true;
            }
            continue;
          }
          executeResult = true;
          this.pageStack.push(this.pageCurrent);
          this.pageCurrent = result.page;
        } else {
          executeResult = false;
        }
      } else if ((page as CommandPage).command) {
        const commandPage = page as CommandPage;
        if (commandPage.command) {
          const title = commandPage.title;
          const message = commandPage.alert ? chalk.red(commandPage.alert) : commandPage.info;
          const command = commandPage.command;
          if (typeof command === "string") {
            if (command === "back") {
              this.pageStack.pop();
              const page = this.pageStack.pop();
              if (!page) {
                executeResult = false;
              } else {
                this.pageCurrent = page;
                executeResult = true;
              }
            } else if (command === "quit") {
              executeResult = false;
            }
          } else {
            executeResult = await executeCommand(command, title, message);

            this.pageCurrent = pageRoot;
            this.pageStack = [];
          }
        } else {
          executeResult = false;
        }
      }
    }
    while (executeResult !== false);
  }

  /**
   * Quit confirm
   * @returns true if confirm quitting
   */
  private async quiting() {
    return await confirmQuit();
  }

  /**
   * Start console app
   */
  public async start() {
    if (!(await this.initialize())) {
      return exit(0);
    }

    do {
      await this.working();
    } while (!(await this.quiting()));

    return exit(0);
  }
}
