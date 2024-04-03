import { getHttpEndpoint } from "@orbs-network/ton-access";
import { Address, beginCell, fromNano, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { MainContract } from "../../common/contracts/MainContract";

import dotenvFlow from "dotenv-flow";
import qs from "qs";
dotenvFlow.config({ debug: true });

const TON_MAINNET = process.env.TON_NETWORK === "mainnet";

const bot = new Telegraf(process.env.TG_BOT_TOKEN ?? "");

bot.start((ctx) =>
  ctx.reply("Welcome to our counter app!", {
    reply_markup: {
      keyboard: [
        ["Increment by 5"],
        ["Deposit 1 TON"],
        ["Withdraw 0.7 TON"],
        ["Get balance"],
      ],
    },
  })
);

bot.hears("Increment by 5", (ctx) => {
  // const link = `https://${
  //   TON_MAINNET ? "" : "test."
  // }tonhub.com/transfer/${process.env.SC_ADDRESS}?${qs.stringify({
  //   text: "Increment counter by 5",
  //   amount: toNano("0.01").toString(10),
  //   msg_body: msg_body.toBoc({ idx: false }).toString("base64"),
  // })}`;

  const msg_body = beginCell().storeUint(1, 32).storeUint(5, 32).endCell();

  const link = `ton://transfer/${process.env.SC_ADDRESS}?${qs.stringify({
    text: "Increment counter by 5",
    amount: toNano("0.01").toString(10),
    bin: msg_body.toBoc({ idx: false }).toString("base64"),
  })}`;

  ctx.reply("To increment counter by 5 please sign the transation below", {
    reply_markup: {
      inline_keyboard: [[{ text: "Sign transaction", url: link }]],
    },
  });
});

bot.hears("Deposit 1 TON", (ctx) => {
  const msg_body = beginCell().storeUint(2, 32).endCell();

  // const link = `https://${
  //   TON_MAINNET ? "" : "test."
  // }tonhub.com/transfer/${process.env.SC_ADDRESS}?${qs.stringify({
  //   text: "Deposit 1 TON",
  //   amount: toNano("1").toString(10),
  //   msg_body: msg_body.toBoc({ idx: false }).toString("base64"),
  // })}`;

  const link = `ton://transfer/${process.env.SC_ADDRESS}?${qs.stringify({
    // text: "Deposit 1 TON",
    amount: toNano("1").toString(10),
    bin: msg_body.toBoc({ idx: false }).toString("base64"),
  })}`;

  ctx.reply("To deposit 1 TON please sign the transation below", {
    reply_markup: {
      inline_keyboard: [[{ text: "Sign transaction", url: link }]],
    },
  });
});

bot.hears("Withdraw 0.7 TON", (ctx) => {
  const msg_body = beginCell()
    .storeUint(3, 32)
    .storeCoins(toNano("0.7"))
    .endCell();

  const link = `ton://transfer/${process.env.SC_ADDRESS}?${qs.stringify({
    text: "Withdraw 0.7 TON",
    amount: toNano("0.01").toString(10),
    bin: msg_body.toBoc({ idx: false }).toString("base64"),
  })}`;

  ctx.reply("To withdraw 0.7 TON please sign the transation below", {
    reply_markup: {
      inline_keyboard: [[{ text: "Sign transaction", url: link }]],
    },
  });
});

bot.hears("Get balance", async (ctx) => {
  const client = new TonClient({
    endpoint: await getHttpEndpoint({ network: "testnet" }),
  });
  const contract = new MainContract(
    Address.parse(process.env.SC_ADDRESS!) // replace with your address from tutorial 2 step 8
  );
  const openedContract = client.open(contract);
  const balance = await openedContract.getBalance();
  ctx.reply(`Balance: ${fromNano(balance.balance)}`);
});

bot.on(message("web_app_data"), async (ctx) => {
  ctx.reply(ctx.webAppData?.data.text() ?? "undef");
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
