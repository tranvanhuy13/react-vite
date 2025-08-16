import React, { useState } from "react";

const api_host = "http://localhost:8000";

const CreateQuestion: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch(`${api_host}/api/questions/create-question/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: question }),
      });
      if (res.status === 403) {
        setStatus("Forbidden: You are not authorized.");
        setLoading(false);
        return;
      }
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setStatus("Error parsing response");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setStatus((data && data.detail) || "Failed to create question");
      } else {
        setStatus("Question created successfully!");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectIndex(0);
      }
    } catch (err) {
      setStatus("Network error");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 32, maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Create Question</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
            Question
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 8, marginTop: 4, fontSize: 16 }}
            />
          </label>
        </div>
        {options.map((opt, idx) => (
          <div key={idx} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
              Option {idx + 1}
              <input
                type="text"
                value={opt}
                onChange={e => handleOptionChange(idx, e.target.value)}
                required
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 8, marginTop: 4, fontSize: 16 }}
              />
            </label>
          </div>
        ))}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500 }}>
            Correct Option
            <select
              value={correctIndex}
              onChange={e => setCorrectIndex(Number(e.target.value))}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 8, marginTop: 4, fontSize: 16 }}
            >
              {options.map((_, idx) => (
                <option key={idx} value={idx}>Option {idx + 1}</option>
              ))}
            </select>
          </label>
        </div>
        {status && (
          <div style={{ color: status.includes("success") ? "#27ae60" : "#e74c3c", marginBottom: 14, textAlign: "center", fontWeight: 500 }}>{status}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "12px 0", background: "#4f8cff", color: "#fff", border: "none", borderRadius: 8, fontSize: 17, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(79,140,255,0.08)", transition: "background 0.2s" }}
        >
          {loading ? "Creating..." : "Create Question"}
        </button>
      </form>
    </div>
  );
};

export default CreateQuestion;
