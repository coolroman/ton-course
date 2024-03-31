import { CompilerConfig } from "@ton/blueprint";

export const compile = {
  lang: "func",
  targets: ["contracts/main.fc"],
} satisfies CompilerConfig;
