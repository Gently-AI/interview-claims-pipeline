import { useEffect, useState } from "react";

type Health = { ok: boolean; database: string };

export function App() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json() as Promise<Health>)
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 640 }}>
      <h1>Scaffold</h1>
      <p style={{ color: "#666" }}>Running.</p>
      <p style={{ color: "#666" }}>
        api: {health ? `ok, database ${health.database}` : "not reachable"}
      </p>
    </main>
  );
}
