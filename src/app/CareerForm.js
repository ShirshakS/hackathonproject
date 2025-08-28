import { useState } from "react";

export default function CareerForm() {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [yoe, setYoe] = useState("");
  const [stack, setStack] = useState("");
  const [stackError, setStackError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const validateForm = (field, value) => {
    switch (field)
    {
        case "title":
            setTitle(value);
            if(!isNaN(value))
            {
                setTitleError("Enter a valid title");
            }
            else
            {
                setTitleError("");
            }
            break;
        case "stack":
            setStack(value);
            if(!isNaN(value))
            {
                setStackError("Enter a valid tech stack");
            }
            else
            {
                setStackError("");
            }
            break;
        case "yoe":
            setYoe(value);
            if(isNaN(value) || value < 0)
            {
                setYoeError("Enter a valid number of years");
            }
            else
            {
                setYoeError("");
            }
            break;
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    const prompt = `Given my current job title: ${title}, years of experience: ${yoe}, and tech stack: ${stack}, recommend a suitable job path in India and suggest top online courses to help me achieve it.`;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt })
      });
      const data = await res.json();
      setResult(data.reply || data.error || "No response");
    } catch {
      setResult("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="career-form-container">
      <h2 className="career-form-title">Career Path & Course Recommendation</h2>
      <form className="career-form" onSubmit={handleSubmit}>
        <div className="career-form-group">
          <label htmlFor="job-title">Current Job Title</label>
          <input
            id="job-title"
            type="text"
            value={title}
            onChange={e => validateForm("title", e.target.value)}
            placeholder="e.g. Frontend Developer"
            required
          />
        </div>
        <div className="career-form-group">
          <label htmlFor="yoe">Years of Experience</label>
          <input
            id="yoe"
            type="number"
            value={yoe}
            onChange={e => validateForm("yoe", e.target.value)}
            min="0"
            placeholder="e.g. 3"
            required
          />
        </div>
        <div className="career-form-group">
          <label htmlFor="stack">Tech Stack</label>
          <input
            id="stack"
            type="text"
            value={stack}
            onChange={e => validateForm("stack", e.target.value)}
            placeholder="e.g. React, Node.js, AWS"
            required
          />
        </div>
        <button className="career-form-btn" type="submit" disabled={loading}>
          {loading ? "Recommending..." : "Get Recommendation"}
        </button>
      </form>
      {result && (
        <div className="career-result">
          <h3>Recommendation</h3>
          <div>{result}</div>
        </div>
      )}
    </div>
  );
}
