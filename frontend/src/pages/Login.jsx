import { useState } from "react";
import { api } from "../Api.jsx";
import "../styles/Login.css"

export default function Login({ setToken }) {
  const [wardId, setWardId] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await api.post("/auth/login", { wardId, password });
    setToken(res.data.token);
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <h2>ICU Ward Login</h2>
      <p>Authorized medical staff only</p>

      <input
        placeholder="Ward ID"
        onChange={e => setWardId(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>

      <div className="login-footer">
        Secure Hospital Access System
      </div>
    </div>
  </div>
);

}
