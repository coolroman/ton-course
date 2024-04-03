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
    <div className="p-4">
      <div className="mb-2 flex justify-center">
        <TonConnectButton />
      </div>
      <div>
        <table className="w-[90%] table-fixed text-left">
          <thead>
            <tr>
              <th className="w-[100px]">Name</th>
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
              <td>
                <div className="truncate">
                  <span>{contract_address}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Balance:</td>
              <td className="Hint">
                {contract_balance == null ? "null" : fromNano(contract_balance)}
              </td>
            </tr>
            <tr>
              <td>Counter:</td>
              <td>{counter_value ?? "Loading..."}</td>
            </tr>
          </tbody>
        </table>

        {connected && (
          <>
            <button onClick={() => sendIncrement()}>Increment by 5</button>
            <br />
            <button onClick={() => sendDeposit()}>Deposit 1</button>
            <button onClick={() => sendWithdrawalRequest()}>
              Withdraw 0.7
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
