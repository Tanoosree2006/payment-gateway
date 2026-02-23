import { Outlet, Link, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Later you can clear token here
    // localStorage.removeItem("token");

    navigate("/"); // go back to login page
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-container">
          <h3 className="logo">Payment Gateway</h3>

          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>

            {/* Logout Button */}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
}

export default Layout;