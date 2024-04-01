import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { Address, Cell, contractAddress } from "@ton/core";
import { TonClient4 } from "ton";
import { hex } from "../../build/MainContract.compiled.json";

import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

const MAINNET = !!process.env.MAINNET;

async function onchainTestScript() {
  const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
  const dataCell = new Cell();

  const address = contractAddress(0, {
    code: codeCell,
    data: dataCell,
  });

  console.log(`NET: "${MAINNET ? "mainnet" : "testnet"}"`);

  const endpoint = await getHttpV4Endpoint({
    network: MAINNET ? "mainnet" : "testnet",
  });

  const client4 = new TonClient4({ endpoint });

  const latestBlock = await client4.getLastBlock();
  const status = await client4.getAccount(latestBlock.last.seqno, address);

  if (status.account.state.type !== "active") {
    console.log("Contract is not active");
    return;
  }

  // const link = `https://${
  //   MAINNET ? "" : "test."
  // }tonhub.com/transfer/${address.toString({
  //   testOnly: !MAINNET,
  // })}?${qs.stringify({
  //   text: "Deploy contract",
  //   amount: toNano("0.01").toString(10),
  // })}`;

  // qrcode.generate(link, { small: true }, (code) => {
  //   console.log(code);
  // });

  let recent_sender_archive: Address;

  setInterval(async () => {
    const latestBlock = await client4.getLastBlock();
    const { exitCode, result } = await client4.runMethod(
      latestBlock.last.seqno,
      address,
      "get_the_latest_sender"
    );

    if (exitCode !== 0) {
      console.log("Running getter method failed");
      return;
    }
    if (result[0].type !== "slice") {
      console.log("Unknown result type");
      return;
    }

    let most_recent_sender = result[0].cell.beginParse().loadAddress();

    if (
      most_recent_sender &&
      most_recent_sender.toString() !== recent_sender_archive?.toString()
    ) {
      console.log(
        "New recent sender found: " +
          most_recent_sender.toString({ testOnly: true })
      );
      recent_sender_archive = most_recent_sender;
    }
  }, 2000);
}

onchainTestScript();
