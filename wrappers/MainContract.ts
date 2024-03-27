import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from "@ton/core";

export type MainContractConfig = {
  number: number;
  address: Address;
};

export function mainContractConfigToCell(config: MainContractConfig): Cell {
  return beginCell()
    .storeUint(config.number, 32)
    .storeAddress(config.address)
    .endCell();
}

export class MainContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromConfig(
    config: MainContractConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = mainContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);
    return new MainContract(address, init);
  }

  async sendIncrement(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    incerement_by: number
  ) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(1, 32).storeUint(incerement_by, 32).endCell(),
    });
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_contract_storage_data", []);
    return {
      counter: stack.readNumber(),
      recent_sender_address: stack.readAddress(),
    };
  }
}
