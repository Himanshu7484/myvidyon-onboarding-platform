import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

function Onboarding() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState('');

  // Load the user's steps and progress from the backend
  useEffect(() => {
    apiRequest('/onboarding', { token })
      .then((result) => setData(result))
      .catch((err) => {
        if (
          err.message === 'Invalid or expired token' ||
          err.message === 'Login required'
        ) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError(err.message);
        }
      });
  }, [navigate, token]);

  // Mark one step as completed
  const completeStep = async (stepKey) => {
    setError('');
    setSavingKey(stepKey);

    try {
      const result = await apiRequest(`/onboarding/steps/${stepKey}`, {
        method: 'PUT',
        body: { status: 'COMPLETED' },
        token,
      });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingKey('');
    }
  };

  if (!data && error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  if (data.totalCount === 0) {
    return (
      <div className="container">
        <h2>Onboarding</h2>
        <p>There are no onboarding steps for this account.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  const currentStep = data.steps.find((s) => s.status !== 'COMPLETED');
  const percent = Math.round((data.completedCount / data.totalCount) * 100);
  const allDone = !currentStep;

  return (
    <div className="container">
      <h2>Your onboarding</h2>

      <p>
        {data.completedCount} of {data.totalCount} steps completed
      </p>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>

      {allDone && (
        <p className="success">
          All steps completed! Your application status is{' '}
          <strong>{data.onboardingStatus}</strong>.
        </p>
      )}

      {error && <p className="error">{error}</p>}

      <div className="steps">
        {data.steps.map((step, index) => {
          const isDone = step.status === 'COMPLETED';
          const isCurrent = currentStep && currentStep.key === step.key;

          let className = 'step-card';
          if (isDone) className += ' done';
          if (isCurrent) className += ' current';

          return (
            <div key={step.key} className={className}>
              <div className="step-number">{isDone ? 'Done' : index + 1}</div>
              <div className="step-body">
                <h3>{step.title}</h3>
                <p>{step.description}</p>

                {isCurrent && (
                  <button
                    className="step-button"
                    onClick={() => completeStep(step.key)}
                    disabled={savingKey === step.key}
                  >
                    {savingKey === step.key ? 'Saving...' : 'Mark as complete'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p>
        <Link to="/dashboard">Back to dashboard</Link>
      </p>
    </div>
  );
}

export default Onboarding;