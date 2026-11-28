import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './components/ProtectedRoute';

function Home() {
  return (
    <div className="container">
      <h1>MyVidyon</h1>
      <p>Intelligent Onboarding Platform</p>
      <p>
        <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;