export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TG_BOT_TOKEN?: string;
      TON_NETWORK?: "testnet" | "mainnet";
      SC_ADDRESS?: string;
    }
  }
}
