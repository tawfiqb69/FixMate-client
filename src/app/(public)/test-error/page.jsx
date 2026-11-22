function failOnce() {
  if (globalThis._failOnce !== true) {
    globalThis._failOnce = true;
    throw new Error("Test error");
  }
}

export default function TestError() {
  failOnce();
  return <p className="p-10">Recovered after Try Again.</p>;
}