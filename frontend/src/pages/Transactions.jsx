import { useEffect, useState } from "react";
import "./Transactions.css";

const API = import.meta.env.VITE_API_URL;

const headers = {
  "X-Api-Key": import.meta.env.VITE_API_KEY,
  "X-Api-Secret": import.meta.env.VITE_API_SECRET,
};

export default function Transactions() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/v1/payments`, { headers })
      .then(res => res.json())
      .then(setPayments);
  }, []);

  return (
    <div className="transactions-page">
      <h2>Transactions</h2>

      <div className="table-container">
        <table data-testid="transactions-table">
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
              <tr key={p.id} data-testid="transaction-row">
                <td data-testid="payment-id">{p.id}</td>
                <td data-testid="order-id">{p.order_id}</td>
                <td data-testid="amount">₹{p.amount / 100}</td>
                <td data-testid="method">{p.method}</td>
                <td
                  data-testid="status"
                  className={
                    p.status === "success"
                      ? "status-success"
                      : "status-failed"
                  }
                >
                  {p.status}
                </td>
                <td data-testid="created-at">
                  {new Date(p.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}