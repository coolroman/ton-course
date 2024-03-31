import { NetworkProvider, compile } from "@ton/blueprint";
import { address, toNano } from "@ton/core";
import { MainContract } from "../wrappers/MainContract";

export async function run(provider: NetworkProvider) {
  const addr =
    provider.network() === "mainnet"
      ? "EQC20U11vtwT98AeLZhq0npsBwTTRUlmmQ1mAjFetaMIitt_"
      : "0QDvhAx7S9U54AL0KnQwkNQXsyySitEEptwVK80WqPFLvgx6";
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

  openedContract.sendDeploy(provider.sender(), toNano("0.01"));

  await provider.waitForDeploy(myContract.address);
}
