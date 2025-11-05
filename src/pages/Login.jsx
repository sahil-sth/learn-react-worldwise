import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(
    function () {
      console.log("useEffect called");
      if (isAuthenticated) {
        navigate("/app", { replace: true });
      }
    },
    [isAuthenticated, navigate]
  );

  function handleLogin(e) {
    e.preventDefault();
    console.log("Button clicked");
    if (email && password) {
      login(email, password);
    }
  }
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
