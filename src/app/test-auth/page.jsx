"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function TestAuth() {
  const [out, setOut] = useState("");

  async function doSignIn() {
    const res = await authClient.signIn.email({
      email: "test1@example.com",
      password: "Test1234",
    });
    setOut(JSON.stringify(res, null, 2));
  }

  async function doSession() {
    const res = await authClient.getSession();
    setOut(JSON.stringify(res.data?.user ?? res, null, 2));
  }

  async function doToken() {
    const { data, error } = await authClient.token();
    if (error || !data?.token) {
      setOut("TOKEN ERROR: " + JSON.stringify(error));
      return;
    }
    const part = data.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(part));
    setOut("Token starts with: " + data.token.slice(0, 20) + "...\n\nPayload:\n" + JSON.stringify(payload, null, 2));
  }

  return (
    <div style={{ padding: 24 }}>
      <button onClick={doSignIn}>1. Sign in</button>{" "}
      <button onClick={doSession}>2. Get session</button>{" "}
      <button onClick={doToken}>3. Get JWT</button>
      <pre>{out}</pre>
    </div>
  );
}