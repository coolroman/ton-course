import { NetworkProvider } from "@ton/blueprint";
import { toNano } from "@ton/core";

import dotenvFlow from "dotenv-flow";
import { get_contract } from "./lib/contract";

dotenvFlow.config({ debug: true });

export async function run(provider: NetworkProvider) {
  const openedContract = await get_contract(provider, process.env.SC_ADDRESS!);

  if (openedContract != null) {
    await openedContract.sendDestroyRequest(provider.sender(), toNano("0.05"));
  }
}
