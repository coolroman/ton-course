import { TonConnectButton } from "@tonconnect/ui-react";
import { get_contract } from "../../common/contracts/env";
import "./App.css";
import { useMainContract } from "./hooks/useMainContract";

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
  } = useMainContract(get_contract("testnet"));

  return (
    <div>
      <div className="mb-2 flex justify-center">
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Our contract Address</b>
          <div className="Hint">
            {/* {contract_address?.slice(0, 4)}...
            {contract_address?.slice(contract_address.length - 4)} */}
            {contract_address}
          </div>
          <b>Our contract Balance</b>
          <div className="Hint">{contract_balance}</div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
