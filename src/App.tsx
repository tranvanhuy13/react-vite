import React, { useEffect, useState } from 'react';

type Question = {
  question: string;
  options: string[];
};

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/questions/')
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch questions:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quiz Questions</h1>
      {questions.map((q, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h3>{index + 1}. {q.question}</h3>
          <ul>
            {q.options.map((option, optIdx) => (
              <li key={optIdx}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}



export default App;
