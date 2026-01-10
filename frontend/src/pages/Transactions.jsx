import { useEffect, useState } from "react";
import "../App.css";

const API = "http://localhost:8000";
const headers = {
  "X-Api-Key": "key_test_abc123",
  "X-Api-Secret": "secret_test_xyz789",
};

export default function Transactions() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/v1/payments`, { headers })
      .then(res => res.json())
      .then(setPayments);
  }, []);

  return (
    <div className="container">
      <h2>Transactions</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.order_id}</td>
                <td>₹{p.amount / 100}</td>
                <td>{p.method}</td>
                <td className={p.status === "success" ? "status-success" : "status-failed"}>
                  {p.status}
                </td>
                <td>{new Date(p.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
