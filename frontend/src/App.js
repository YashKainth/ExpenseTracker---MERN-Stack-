import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import DashSidebar from "./Components/DashSidebar";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register"; 
import ProtectedRoute from "./Components/ProtectedRoute";
import { Dashboard } from "./Components/Dashboard";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <DashSidebar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
