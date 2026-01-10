import { useEffect, useState } from "react";
import "../App.css";

const API = "http://localhost:8000";
const headers = {
  "X-Api-Key": "key_test_abc123",
  "X-Api-Secret": "secret_test_xyz789",
};

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, amount: 0, success: 0 });

  useEffect(() => {
    fetch(`${API}/api/v1/payments`, { headers })
      .then(res => res.json())
      .then(data => {
        const total = data.length;
        const successCount = data.filter(p => p.status === "success").length;
        const amount = data.reduce((sum, p) => sum + p.amount, 0);

        setStats({
          total,
          amount,
          success: total === 0 ? 0 : Math.round((successCount / total) * 100),
        });
      });
  }, []);

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <div className="card-grid">
        <div className="card">
          <h3>Total Transactions</h3>
          <p>{stats.total}</p>
        </div>

        <div className="card">
          <h3>Total Amount</h3>
          <p>₹{stats.amount / 100}</p>
        </div>

        <div className="card">
          <h3>Success Rate</h3>
          <p>{stats.success}%</p>
        </div>
      </div>

      <div className="api-box">
        API Key: key_test_abc123 <br />
        API Secret: secret_test_xyz789
      </div>
    </div>
  );
}
