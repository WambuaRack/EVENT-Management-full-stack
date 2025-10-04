import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetch events (only public)
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/events/", { headers });
      const allEvents = Array.isArray(res.data) ? res.data : res.data.results || [];
      const publicEvents = allEvents.filter((event) => event.is_public === true);
      setEvents(publicEvents);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  if (!user) return <p className="message">Please log in.</p>;
  if (loading) return <p className="message">Loading public events...</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <div className="user-dashboard">
      <h1>Welcome, {user.username}</h1>
      <h2>Public Events</h2>

      {events.length === 0 ? (
        <p className="message">No public events available</p>
      ) : (
        <div className="events-grid">
          <div className="table-header">
            <span>Title</span>
            <span>Description</span>
            <span>Location</span>
            <span>Start</span>
            <span>End</span>
          </div>
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <span>{event.title}</span>
              <span>{event.description}</span>
              <span>{event.location}</span>
              <span>{new Date(event.start_time).toLocaleString()}</span>
              <span>{new Date(event.end_time).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* CSS */}
      <style jsx>{`
        .user-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f7fa;
          min-height: 100vh;
          color: #1a202c;
        }

        h1 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #2d3748;
          letter-spacing: -0.025em;
        }

        h2 {
          text-align: center;
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: #4a5568;
        }

        .message {
          text-align: center;
          font-size: 1.125rem;
          color: #4a5568;
          padding: 1.5rem;
          background: #edf2f7;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .message.error {
          color: #e53e3e;
          background: #fff5f5;
        }

        .events-grid {
          display: grid;
          gap: 1rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1.5fr 2fr 1.5fr 1.5fr 1.5fr;
          background: #2b6cb0;
          color: white;
          font-weight: 600;
          padding: 1rem;
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #2c5282;
        }

        .event-card {
          display: grid;
          grid-template-columns: 1.5fr 2fr 1.5fr 1.5fr 1.5fr;
          padding: 1.25rem;
          background: #ffffff;
          border-bottom: 1px solid #edf2f7;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          background: #f7fafc;
        }

        .event-card span {
          font-size: 0.95rem;
          color: #2d3748;
          padding: 0.5rem;
          display: flex;
          align-items: center;
        }

        .event-card span:first-child {
          font-weight: 600;
          color: #2b6cb0;
        }

        /* Mobile Responsiveness */
        @media (max-width: 1024px) {
          .events-grid {
            gap: 0.5rem;
          }

          .table-header {
            display: none;
          }

          .event-card {
            grid-template-columns: 1fr;
            padding: 1rem;
            border-radius: 8px;
            margin: 0.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          .event-card span {
            padding: 0.5rem 0;
            font-size: 0.9rem;
            position: relative;
          }

          .event-card span::before {
            content: attr(data-label);
            font-weight: 600;
            color: #4a5568;
            margin-right: 0.5rem;
            text-transform: uppercase;
            font-size: 0.75rem;
          }

          .event-card span:nth-child(1)::before { content: "Title"; }
          .event-card span:nth-child(2)::before { content: "Description"; }
          .event-card span:nth-child(3)::before { content: "Location"; }
          .event-card span:nth-child(4)::before { content: "Start"; }
          .event-card span:nth-child(5)::before { content: "End"; }
        }

        @media (max-width: 600px) {
          h1 {
            font-size: 2rem;
          }

          h2 {
            font-size: 1.5rem;
          }

          .event-card {
            padding: 0.75rem;
          }

          .event-card span {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;