import { Command, ConsoleCommand } from "./command-collection";
import { clientWrapper } from "./client-manager";
import chalk from "chalk";
import prompts from "prompts";
import { print } from "./util";

export const executeCommand = async <T extends string>(command: Command<T> | ConsoleCommand): Promise<void> => {
  if (typeof(command) === "string") {
    return;
  }
  if (command.questions) {
    const result = await prompts(command.questions);
    const state:unknown[] = [];

    if (command.beforeExecute) {
      try {
        const flag = await command.beforeExecute(result, state);
        print(chalk.yellow(flag));
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
      print(chalk.gray(text));
    });

    if (command.afterExecute) {
      try {
        const flag = await command.afterExecute(result, state);
        print(chalk.yellow(flag));
      }
      catch (e) {
        if (e instanceof Error) {
          print(chalk.red(e.message));
        }
        return;
      }
    }
  }
};