import { NetworkProvider } from "@ton/blueprint";
import { Address } from "@ton/core";
import { MainContract } from "../../../common/contracts/MainContract";

export async function get_contract(provider: NetworkProvider, address: string) {
  const sender_addr = provider.sender().address!;

  console.log(`Contract: ${address}`);
  console.log(`Network:  ${provider.network()}`);
  console.log(`Sender:   ${sender_addr}`);

  const contract_addr = Address.parse(address);

  const deployed = await provider.isContractDeployed(contract_addr);

  console.log(`Deployed: ${deployed}`);

  if (!deployed) {
    return null;
  }

  const contract = new MainContract(contract_addr);

  const openedContract = provider.open(contract);

  return openedContract;
}
