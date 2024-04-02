export function get_contract(network: "mainnet" | "testnet" | "custom") {
  return network === "mainnet"
    ? "EQDmMCWaxiZvNyfFJk55aH3_emWCMZYZrD7AgkqDWlX-eytv"
    : "kQCfmubaqTBs_iZITAdCbJcBvFOiHh34VPWXAGC1qHvd4h1g";
}

export function get_owner(network: "mainnet" | "testnet" | "custom") {
  return network === "mainnet"
    ? "UQC20U11vtwT98AeLZhq0npsBwTTRUlmmQ1mAjFetaMIioa6"
    : "EQDvhAx7S9U54AL0KnQwkNQXsyySitEEptwVK80WqPFLvuo1";
}
