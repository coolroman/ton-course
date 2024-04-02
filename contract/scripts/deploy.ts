import { NetworkProvider, compile } from "@ton/blueprint";
import { address, toNano } from "@ton/core";
import { MainContract } from "../../common/contracts/MainContract";
import { get_contract } from "../../common/contracts/env";

export async function run(provider: NetworkProvider) {
  const addr = get_contract(provider.network());
  console.log(`${provider.network()}: ${addr}`);
  const myContract = MainContract.createFromConfig(
    {
      number: 0,
      address: address(addr),
      owner_addres: address(addr),
    },
    await compile("MainContract")
  );

  const openedContract = provider.open(myContract);

  openedContract.sendDeploy(provider.sender(), toNano("0.11"));

  await provider.waitForDeploy(myContract.address);
}
