import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import "./theme.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/status" element={<DashboardPage />} />
        <Route path="/schedule" element={<DashboardPage />} />
        <Route path="/class-schedule" element={<DashboardPage />} />
        <Route path="/absence" element={<DashboardPage />} />
        <Route path="/directory" element={<DashboardPage />} />
        <Route path="/notifications" element={<DashboardPage />} />
        <Route path="/settings" element={<DashboardPage />} />
        <Route path="/help" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
