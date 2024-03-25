import {
  beginCell,
  Cell,
  contractAddress,
  StateInit,
  storeStateInit,
  toNano,
} from "@ton/core";
import qrcode from "qrcode-terminal";
import qs from "qs";
import { hex } from "../build/main.compiled.json";

async function deployScript() {
  const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
  const dataCell = new Cell();

  const stateInit = {
    code: codeCell,
    data: dataCell,
  } satisfies StateInit;

  const stateInitBuilder = beginCell();
  storeStateInit(stateInit)(stateInitBuilder);
  const stateInitCell = stateInitBuilder.endCell();

  const address = contractAddress(0, stateInit);

  console.log(`Address: ${address.toString()}`);
  console.log("Scan the qrcode below:");

  const link = `https://test.tonhub.com/transfer/${address.toString({
    testOnly: true,
  })}?${qs.stringify({
    text: "Deploy contract",
    amount: toNano("0.123").toString(10),
    init: stateInitCell.toBoc({ idx: false }).toString("base64"),
  })}`;

  qrcode.generate(link, { small: true }, (code) => {
    console.log(code);
  });
}

deployScript();
