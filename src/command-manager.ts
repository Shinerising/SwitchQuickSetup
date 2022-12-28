import { Command } from "./command-collection";
import prompts from "prompts";

export const executeCommand = async <T extends string>(command: Command<T>): Promise<void> => {
  if (command.questions) {
    const result = await prompts(command.questions);

    if (command.beforeExecute) {
      try {
        const flag = await command.beforeExecute(result);
        console.log(flag);
      }
      catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
        return;
      }
    }

    const text = command.apply(result);
    console.log(text);

    if (command.afterExecute) {
      try {
        const flag = await command.afterExecute(result);
        console.log(flag);
      }
      catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
        return;
      }
    }
  }
}