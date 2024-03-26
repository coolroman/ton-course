import { describe, test } from "@jest/globals";
import { Cell, toNano } from "@ton/core";
import { Blockchain } from "@ton/sandbox";
import "@ton/test-utils";
import { hex } from "../build/main.compiled.json";
import { MainContract } from "../wrappers/MainContract";

describe("main.fc contract tests", () => {
  test("our first test", async () => {
    const blockchain = await Blockchain.create();
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const myContract = blockchain.openContract(
      MainContract.createFromConfig({}, codeCell)
    );
    const senderWallet = await blockchain.treasury("sender");
    const sentMessageResult = await myContract.sendInternalMessage(
      senderWallet.getSender(),
      toNano("0.05"),
      3
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
    expect(data.total.toString()).toBe("3");
  });
});
