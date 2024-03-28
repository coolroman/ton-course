import { describe, test } from "@jest/globals";
import { Cell, toNano } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import "@ton/test-utils";
import { hex } from "../build/main.compiled.json";
import { MainContract } from "../wrappers/MainContract";

describe("main.fc contract tests", () => {
  let blockchain: Blockchain;
  let myContract: SandboxContract<MainContract>;
  let initWallet: SandboxContract<TreasuryContract>;
  let ownerWallet: SandboxContract<TreasuryContract>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    initWallet = await blockchain.treasury("initWallet");
    ownerWallet = await blockchain.treasury("ownerWallet");

    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];

    myContract = blockchain.openContract(
      MainContract.createFromConfig(
        {
          number: 1,
          address: initWallet.address,
          owner_addres: ownerWallet.address,
        },
        codeCell
      )
    );
  });

  test("should increment counter and get the most recent sender address", async () => {
    const senderWallet = await blockchain.treasury("sender");

    const sentMessageResult = await myContract.sendIncrement(
      senderWallet.getSender(),
      toNano("0.05"),
      2
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    const data = await myContract.getData();

    expect(data.recent_sender_address.toString()).toBe(
      senderWallet.address.toString()
    );
    expect(data.counter).toBe(3);
  });

  it("successfully deposits funds", async () => {
    const senderWallet = await blockchain.treasury("sender");

    const depositMessageResult = await myContract.sendDeposit(
      senderWallet.getSender(),
      toNano("5")
    );

    expect(depositMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    const balanceRequest = await myContract.getBalance();

    expect(balanceRequest.balance).toBeGreaterThan(toNano("4.99"));
  });

  it("should return deposit funds as not command is sent", async () => {
    const senderWallet = await blockchain.treasury("sender");

    const depositMessageResult = await myContract.sendNoCodeDeposit(
      senderWallet.getSender(),
      toNano("5")
    );

    expect(depositMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: false,
    });

    const balanceRequest = await myContract.getBalance();

    expect(balanceRequest.balance).toEqual(0);
  });

  it("successfully withdraws funds on behalf of the owner", async () => {
    const senderWallet = await blockchain.treasury("sender");

    const depositMessageResult = await myContract.sendDeposit(
      senderWallet.getSender(),
      toNano("5")
    );

    const withdrawalMessageResult = await myContract.sendWithdrawalRequest(
      ownerWallet.getSender(),
      toNano("0.05"),
      toNano(1)
    );

    expect(withdrawalMessageResult.transactions).toHaveTransaction({
      from: myContract.address,
      to: ownerWallet.address,
      success: true,
      value: toNano(1),
    });
  });

  it("fails to withdraw funds on behalf of non-owner", async () => {
    const senderWallet = await blockchain.treasury("sender");

    const depositMessageResult = await myContract.sendDeposit(
      senderWallet.getSender(),
      toNano("5")
    );

    const withdrawalMessageResult = await myContract.sendWithdrawalRequest(
      senderWallet.getSender(),
      toNano("0.05"),
      toNano(1)
    );

    expect(withdrawalMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: false,
      exitCode: 103,
    });
  });

  it("fails to withdraw funds because of lack of balance", async () => {
    const withdrawalMessageResult = await myContract.sendWithdrawalRequest(
      ownerWallet.getSender(),
      toNano("0.05"),
      toNano(1)
    );

    expect(withdrawalMessageResult.transactions).toHaveTransaction({
      from: ownerWallet.address,
      to: myContract.address,
      success: false,
      exitCode: 104,
    });
  });
});
