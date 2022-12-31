import prompts from "prompts";
import chalk from "chalk";
import { print, clear, generateHeader } from "./util";

export const printPage = async <T extends string = string>(header?: string, message?: string, questions?: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>, options?: prompts.Options) => {
  if (header) {
    clear();
    print(chalk.green(generateHeader(header)));
  }
  if (message) {
    print(message);
  }
  if (questions) {
    const result = await prompts(questions, options);
    return result;
  }
  return null;
};