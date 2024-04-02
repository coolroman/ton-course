import { Address, OpenedContract, toNano } from "@ton/core";
import { useEffect, useState } from "react";
import { MainContract } from "../../../common/contracts/MainContract";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./userTonConnect";

export function useMainContract(contract_address: string) {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<null | number>(null);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse(contract_address) // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      const { balance } = await mainContract.getBalance();
      setBalance(balance);
      await sleep(5000);
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    recent_sender_address: contractData?.recent_sender.toString(),
    ...contractData,
    sendIncrement: () =>
      mainContract?.sendIncrement(sender, toNano("0.005"), 5),
    sendDeposit: () => mainContract?.sendDeposit(sender, toNano("1")),
    sendWithdrawalRequest: () =>
      mainContract?.sendWithdrawalRequest(sender, toNano("0.1"), toNano("0.7")),
    destroyContract: () =>
      mainContract?.sendDestroyRequest(sender, toNano("0.05")),
  };
}
