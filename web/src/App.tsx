import { TonConnectButton } from "@tonconnect/ui-react";
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return <TonConnectButton />;
}

export default App;
