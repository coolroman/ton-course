export function get_contract(network: "mainnet" | "testnet" | "custom") {
  return network === "mainnet"
    ? "EQDmMCWaxiZvNyfFJk55aH3_emWCMZYZrD7AgkqDWlX-eytv"
    : "kQC9mA0sXZOZBBTyW1Lg46PyqlHf3bBJUKFUHfBo6zuN6RlC";
}
