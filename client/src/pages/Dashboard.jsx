import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const clearLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    apiRequest('/auth/me', { token })
      .then((data) => setUser(data.user))
      .catch(() => {
        // The token is missing, invalid or expired
        clearLogin();
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    clearLogin();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Welcome, {user.name}!</h2>

      <div className="form">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Account type:</strong> {user.role}</p>
        <p><strong>Onboarding status:</strong> {user.onboardingStatus}</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;