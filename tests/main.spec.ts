import { describe, test } from "@jest/globals";
import { Cell, toNano } from "@ton/core";
import { Blockchain } from "@ton/sandbox";
import "@ton/test-utils";
import { hex } from "../build/main.compiled.json";
import { MainContract } from "../wrappers/MainContract";

describe("main.fc contract tests", () => {
  test("should increment counter and get the most recent sender address", async () => {
    const blockchain = await Blockchain.create();
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const initAddress = await blockchain.treasury("initAddress");
    const myContract = blockchain.openContract(
      MainContract.createFromConfig(
        { number: 1, address: initAddress.address },
        codeCell
      )
    );
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
});
