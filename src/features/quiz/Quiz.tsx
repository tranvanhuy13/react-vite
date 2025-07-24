import React, { useEffect, useState } from "react";

type Question = {
  question: string;
  options: string[];
};

type Result = {
  correct_answer: number;
  incorrect_answers: number;
  time_seconds: number;
};

type QuizProps = {
  token: string;
};

const Quiz: React.FC<QuizProps> = ({ token }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/questions/get-questions/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setQuizId(data.quiz_id);
        setSelectedOptions(new Array(data.questions.length).fill(-1));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions", err);
        setLoading(false);
      });
  }, [token]);

  const handleOptionChange = (optionIdx: number) => {
    const updated = [...selectedOptions];
    updated[currentIndex] = optionIdx;
    setSelectedOptions(updated);
  };

  const submitAnswer = async () => {
    const selected = selectedOptions[currentIndex];
    if (selected === -1 || !token) return;
    try {
      setSubmitting(true);
      await fetch(`http://127.0.0.1:8000/api/questions/${quizId}/validate-question/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ selected_option: selected }),
      });
    } catch (error) {
      console.error("Submit failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    await submitAnswer();
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    await submitAnswer();
    if (!token) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/questions/${quizId}/result/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Failed to fetch result", err);
    }
  };

  if (loading) return <p>Loading questions...</p>;

  if (result) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Quiz Completed</h2>
        <p><strong>Correct Answers:</strong> {result.correct_answer}</p>
        <p><strong>Incorrect Answers:</strong> {result.incorrect_answers}</p>
        <p><strong>Time Taken:</strong> {result.time_seconds} seconds</p>
      </div>
    );
  }

  const question = questions[currentIndex];
  const selected = selectedOptions[currentIndex];

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Question {currentIndex + 1} of {questions.length}</h2>
      <h3>{question.question}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {question.options.map((opt, idx) => (
          <li key={idx}>
            <label>
              <input
                type="radio"
                name={`question-${currentIndex}`}
                value={idx}
                checked={selected === idx}
                onChange={() => handleOptionChange(idx)}
                disabled={submitting}
              />
              {" "}{opt}
            </label>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePrevious} disabled={currentIndex === 0 || submitting}>
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button onClick={handleNext} disabled={selected === -1 || submitting} style={{ marginLeft: "10px" }}>
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={selected === -1 || submitting} style={{ marginLeft: "10px" }}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
