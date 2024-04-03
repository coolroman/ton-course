export function get_contract(network: "mainnet" | "testnet" | "custom") {
  return network === "mainnet"
    ? "EQDmMCWaxiZvNyfFJk55aH3_emWCMZYZrD7AgkqDWlX-eytv"
    : "kQCwghD8dd2gT0BqB3JixA0bN7cFUHcAMuktIxBPhYfGY3Pe";
}

export function get_owner(network: "mainnet" | "testnet" | "custom") {
  return network === "mainnet"
    ? "UQC20U11vtwT98AeLZhq0npsBwTTRUlmmQ1mAjFetaMIioa6"
    : "EQDvhAx7S9U54AL0KnQwkNQXsyySitEEptwVK80WqPFLvuo1";
}
