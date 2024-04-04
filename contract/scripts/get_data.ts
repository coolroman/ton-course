import { NetworkProvider } from "@ton/blueprint";

import dotenvFlow from "dotenv-flow";
import { get_contract } from "./lib/contract";

dotenvFlow.config({ debug: true });

export async function run(provider: NetworkProvider) {
  const openedContract = await get_contract(provider, process.env.SC_ADDRESS!);

  if (openedContract != null) {
    const data = await openedContract.getData();

    console.log(`Owner:   ${data.owner_address.toString()}`);
    console.log(`Sender:  ${data.recent_sender.toString()}`);
    console.log(`Counter: ${data.number}`);
  }
}
