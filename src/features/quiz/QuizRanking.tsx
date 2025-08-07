import React, { useEffect, useState } from "react";

const api_host = "http://localhost:8000";

type RankingEntry = {
  quiz_id: string;
  score: number;
  time_taken: number;
};

const QuizRanking: React.FC = () => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${api_host}/api/questions/ranking/`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch ranking');
        }
        const data = await res.json();
        setRankings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading ranking...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2>Quiz Ranking</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Quiz ID</th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Score</th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Time Taken (s)</th>
          </tr>
        </thead>
        <tbody>
          {rankings.length === 0 ? (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16 }}>No ranking data available.</td></tr>
          ) : (
            rankings.map((entry, idx) => (
              <tr key={idx}>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{entry.quiz_id}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{entry.score}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{entry.time_taken}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuizRanking;
