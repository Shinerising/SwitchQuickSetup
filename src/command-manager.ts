import { Command } from "./command-collection";
import prompts from 'prompts';

export const executeCommand = async <T extends string>(command: Command<T>): Promise<void> => {
  if (command.questions) {
    const result = await prompts(command.questions);
    const text = command.apply(result);
    console.log(text);
  }
}