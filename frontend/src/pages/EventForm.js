import React, { useState } from "react";
import API from "../api";

export default function EventForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Basic validation check (can be expanded)
      if (!form.title || !form.start_time || !form.end_time) {
        throw new Error("Title and time fields are required.");
      }
      
      await API.post("events/", form);
      
      // Clear form and notify parent
      setForm({ title: "", description: "", location: "", start_time: "", end_time: "" });
      if (onCreated) onCreated();
      alert("Event created successfully!");

    } catch (err) {
      console.error("Event creation failed:", err);
      // Display a user-friendly error
      const message = err.response?.data?.detail || err.message || "Failed to create event. Please check your data.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="event-form">
        <h3 className="form-header">Create New Event</h3>
        
        <input
          placeholder="Title (required)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows="3"
        />
        
        <label>Start Time (required):</label>
        <input
          type="datetime-local"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          required
        />
        <label>End Time (required):</label>
        <input
          type="datetime-local"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          required
        />

        {submitError && <p className="error-message">{submitError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Event"}
        </button>
      </form>

      {/* Embedded CSS Styling with Gradient */}
      <style jsx>{`
        .form-wrapper {
          max-width: 500px;
          margin: 20px auto;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          /* Background Gradient for the form wrapper */
          background: linear-gradient(145deg, #f4f7f9, #e0e5e9);
        }

        .event-form {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-header {
          font-size: 1.5em;
          font-weight: 600;
          color: #34495e;
          margin-bottom: 10px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 10px;
        }

        label {
            font-size: 0.9em;
            color: #555;
            font-weight: 500;
            margin-bottom: -5px; /* Pull closer to input */
        }

        input,
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #c9d0d6;
          border-radius: 6px;
          box-sizing: border-box;
          font-size: 1em;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus,
        textarea:focus {
          border-color: #007bff; /* Primary Blue focus */
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
          outline: none;
        }

        textarea {
            resize: vertical;
        }

        button {
          width: 100%;
          padding: 12px;
          background-color: #2ecc71; /* Success Green */
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s, opacity 0.2s;
          margin-top: 10px;
        }

        button:hover:not(:disabled) {
          background-color: #27ae60;
        }

        button:disabled {
          background-color: #a5d6a7; /* Lighter shade when disabled */
          cursor: not-allowed;
          opacity: 0.8;
        }

        .error-message {
            color: #d9534f;
            background-color: #f2dede;
            border: 1px solid #d9534f;
            padding: 10px;
            border-radius: 4px;
            font-size: 0.95em;
            text-align: left;
        }
      `}</style>
    </div>
  );
}