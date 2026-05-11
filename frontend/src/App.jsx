import { useState } from 'react';

function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!jobTitle.trim()) {
      setError('Please enter a job title.');
      return;
    }

    setLoading(true);
    setError('');
    setQuestions([]);

    try {
      const response = await fetch('http://localhost:8000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle: jobTitle.trim() }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail || 'Failed to fetch questions.');
      }

      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1>Job Interviewer</h1>
        <p>Enter a job title and get 3 interview questions.</p>

        <form onSubmit={handleSubmit} className="form">
          <input
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            placeholder="e.g. Customer Success Manager"
            aria-label="Job title"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Generate Questions'}
          </button>
        </form>

        {error && <div className="message error">{error}</div>}

        {loading && <div className="message loading">Fetching 3 questions…</div>}

        {questions.length > 0 && (
          <div className="results">
            <h2>Interview Questions</h2>
            <ol>
              {questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
