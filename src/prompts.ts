/**
 * Interactive prompt helpers using Node.js built-in readline/promises.
 * Zero external dependencies.
 */

import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

export async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const answer = await rl.question(question);
    return answer.trim();
  } finally {
    rl.close();
  }
}

export async function promptMultiline(question: string): Promise<string> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    console.log(question);
    console.log("(Paste the value and press Enter)");
    const answer = await rl.question("> ");
    return answer.trim();
  } finally {
    rl.close();
  }
}

export async function choose(
  question: string,
  options: string[],
): Promise<string> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    console.log(question);
    options.forEach((opt, i) => console.log(`  ${i + 1}) ${opt}`));
    while (true) {
      const answer = await rl.question("Choice: ");
      const num = parseInt(answer.trim(), 10);
      if (num >= 1 && num <= options.length) {
        return options[num - 1];
      }
      const match = options.find(
        (o) => o.toLowerCase() === answer.trim().toLowerCase(),
      );
      if (match) return match;
      console.log(`Please enter 1-${options.length}.`);
    }
  } finally {
    rl.close();
  }
}
