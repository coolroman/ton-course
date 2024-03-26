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

export class MainContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromConfig(
    _config: Record<string, unknown>,
    code: Cell,
    workchain = 0
  ) {
    const data = beginCell().endCell();
    const init = { code, data };
    const address = contractAddress(workchain, init);
    return new MainContract(address, init);
  }

  async sendInternalMessage(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    total: number
  ) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(total, 32).endCell(),
    });
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_the_latest_sender", []);
    const { stack: stack2 } = await provider.get("get_sum", []);
    return {
      recent_sender_address: stack.readAddress(),
      total: stack2.readNumber(),
    };
  }
}
