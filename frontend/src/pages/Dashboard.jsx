import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <div className="card">
          <h4>Total Transactions</h4>
          <h2>8</h2>
        </div>

        <div className="card">
          <h4>Total Amount</h4>
          <h2>₹800</h2>
        </div>

        <div className="card">
          <h4>Success Rate</h4>
          <h2>88%</h2>
        </div>
      </div>

      <div className="card api-card">
        <p>API Key: key_test_abc123</p>
        <p>API Secret: secret_test_xyz789</p>
      </div>
    </div>
  );
}

export default Dashboard;