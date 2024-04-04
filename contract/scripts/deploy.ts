import { NetworkProvider, compile } from "@ton/blueprint";
import { toNano } from "@ton/core";
import { MainContract } from "../../common/contracts/MainContract";

export async function run(provider: NetworkProvider) {
  const addr = provider.sender().address!;

  console.log(`Contract: ${process.env.SC_ADDRESS}`);
  console.log(`Network:  ${provider.network()}`);
  console.log(`Sender:   ${addr}`);

  const myContract = MainContract.createFromConfig(
    {
      number: 0,
      address: addr,
      owner_addres: addr,
    },
    await compile("MainContract")
  );

  const openedContract = provider.open(myContract);

  openedContract.sendDeploy(provider.sender(), toNano("0.05"));

  await provider.waitForDeploy(myContract.address, 20);
}
