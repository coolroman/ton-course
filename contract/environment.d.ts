export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SC_ADDRESS?: string;
    }
  }
}
