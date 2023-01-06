import { Command } from "./command-collection";
import { clientWrapper } from "./client-manager";
import chalk from "chalk";
import { print } from "./util";
import { printPage } from "./page-helper";
import prompts from "prompts";

export const executeCommand = async <T extends string>(command: Command<T>, header?: string, message?: string): Promise<boolean | void> => {

  const result = command.questions ? await printPage(header, message, command.questions) : {} as prompts.Answers<string>;

  if (!result) {
    return;
  }
  
  const state: unknown[] = [];

  if (command.beforeExecute) {
    try {
      const flag = await command.beforeExecute(result, state);
      print(chalk.gray(flag));
    }
    catch (e) {
      if (e instanceof Error) {
        print(chalk.red(e.message));
      }
      return;
    }
  }

  const commands = command.apply(result);
  await clientWrapper.executeCommandList(commands.split("\n"), (text: string) => {
    print(chalk.blueBright(text));
  }, (text: string) => {
    print(chalk.yellow(text));
  });

  if (command.afterExecute) {
    try {
      const flag = await command.afterExecute(result, state);
      print(chalk.gray(flag));
    }
    catch (e) {
      if (e instanceof Error) {
        print(chalk.red(e.message));
      }
      return;
    }
  }

  return true;
};