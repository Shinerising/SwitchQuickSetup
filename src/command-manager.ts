import { Command } from "./command-collection";
import { clientWrapper } from "./client-manager";
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

    const commands = command.apply(result);
    await clientWrapper.executeCommandList(commands.split("\n"), (text: string) => {
      console.log(text);
    }, (text: string) => {
      console.log(text);
    });

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