import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Display from "./pages/Display"; 

export default function App() {
  const [token, setToken] = useState("");

  if (window.location.pathname === "/display") {
    return <Display />;
  }
  return token ? <Dashboard token={token} /> : <Login setToken={setToken} />;
}
