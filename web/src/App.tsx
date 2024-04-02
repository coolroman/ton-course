import { fromNano } from "@ton/core";
import { TonConnectButton } from "@tonconnect/ui-react";
import { get_contract } from "../../common/contracts/env";
import "./App.css";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/userTonConnect";

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender_address,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
    destroyContract,
  } = useMainContract(get_contract("testnet"));

  const { connected } = useTonConnect();

  return (
    <div>
      <div className="mb-2 flex justify-center">
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <table className="text-left">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Owner:</td>
                <td>{owner_address?.toString()}</td>
              </tr>
              <tr>
                <td>Sender:</td>
                <td>{recent_sender_address}</td>
              </tr>
              <tr>
                <td>Contract:</td>
                <td>{contract_address}</td>
              </tr>
              <tr>
                <td>Balance:</td>
                <td className="Hint">
                  {contract_balance == null
                    ? "null"
                    : fromNano(contract_balance)}
                </td>
              </tr>
              <tr>
                <td>Counter:</td>
                <td>{counter_value ?? "Loading..."}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {connected && (
          <>
            <button onClick={() => sendIncrement()}>Increment by 5</button>
            <br />
            <button onClick={() => sendDeposit()}>deposit 1</button>
            <button onClick={() => sendWithdrawalRequest()}>
              withdraw 0.7
            </button>
            <br />
            <button onClick={() => destroyContract()}>Destroy contract</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
