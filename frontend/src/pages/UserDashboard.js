import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://127.0.0.1:8000/api";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const eventsData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setEvents(eventsData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
      setLoading(false);
    }
  };

  // RSVP handler
  const handleRsvp = async (eventId, isRsvped) => {
    if (!user || !token) {
      alert("You must be logged in to RSVP.");
      return;
    }

    const endpoint = `${API_URL}/events/${eventId}/rsvp/`;

    try {
      // Optimistic UI update
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId ? { ...e, is_rsvped: !isRsvped, is_updating: true } : e
        )
      );

      if (!isRsvped) {
        await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
        alert("RSVP successful!");
      } else {
        await axios.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        alert("RSVP canceled.");
      }

      setEvents(prev =>
        prev.map(e =>
          e.id === eventId ? { ...e, is_rsvped: !isRsvped, is_updating: false } : { ...e, is_updating: false }
        )
      );
    } catch (err) {
      console.error("RSVP failed:", err.response || err);
      alert(`Action failed: ${err.response?.data?.detail || "Could not complete action."}`);

      // Revert optimistic update on failure
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId ? { ...e, is_rsvped: isRsvped, is_updating: false } : e
        )
      );
    }
  };

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  if (!user) return <p>Please log in to view your dashboard.</p>;
  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.username}!</h1>
      <p className="dashboard-subtitle">Your upcoming events:</p>

      {events.length === 0 ? (
        <div className="no-events-message">No events are currently scheduled.</div>
      ) : (
        <div className="events-grid">
          {events.map(event => {
            const isRsvped = event.is_rsvped;
            const isUpdating = event.is_updating;

            return (
              <div key={event.id} className={`event-card ${event.is_public ? "is-public" : "is-private"}`}>
                <h2>{event.title}</h2>
                <p className="event-description">{event.description}</p>

                <div className="event-details">
                  <p><strong>Location:</strong> {event.location || "N/A"}</p>
                  <p><strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}</p>
                  <p><strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}</p>
                </div>

                {/* RSVP Button */}
                <div className="rsvp-actions">
                  <button
                    onClick={() => handleRsvp(event.id, isRsvped)}
                    disabled={isUpdating}
                    className={`rsvp-button ${isRsvped ? "rsvped" : "not-rsvped"}`}
                  >
                    {isUpdating ? (isRsvped ? "Canceling..." : "RSVPing...") : (isRsvped ? "Cancel RSVP" : "RSVP Now")}
                  </button>
                  <p className="rsvped-status">
                    Status: <span className={isRsvped ? "public-yes" : "public-no"}>{isRsvped ? " Registered" : " Not Registered"}</span>
                  </p>
                </div>

                <p className="public-status">
                  <strong>Visibility:</strong> <span className={event.is_public ? "public-yes" : "public-no"}>{event.is_public ? "Public" : "Private"}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          min-height: 100vh;
          background: linear-gradient(to bottom right, #f0f4f8, #e5ebf1);
        }

        h1 { text-align: center; color: #007bff; }
        .dashboard-subtitle { text-align: center; color: #666; margin-bottom: 30px; }

        .no-events-message { text-align: center; padding: 30px; border: 1px dashed #a0a0a0; border-radius: 8px; color: #555; font-style: italic; background: #fff; }

        .events-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }

        .event-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 6px 16px rgba(0,0,0,0.1); transition: transform 0.2s; display: flex; flex-direction: column; }
        .event-card:hover { transform: translateY(-5px); }
        .event-card h2 { margin-top: 0; margin-bottom: 10px; }
        .event-description { margin-bottom: 15px; color: #555; }

        .rsvp-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px dashed #f0f0f0; padding-top: 10px; }
        .rsvp-button { padding: 8px 15px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background-color 0.2s; min-width: 120px; }
        .rsvp-button:disabled { cursor: not-allowed; opacity: 0.6; }
        .rsvp-button.not-rsvped { background-color: #007bff; color: white; }
        .rsvp-button.rsvped { background-color: #dc3545; color: white; }
        .rsvped-status span.public-yes { font-weight: bold; color: #1e7e34; }
        .rsvped-status span.public-no { font-weight: bold; color: #b8001d; }

        .public-status { padding-top: 10px; margin-top: 10px; border-top: 1px solid #f0f0f0; }
        .public-yes { background-color: #d4edda; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #1e7e34; }
        .public-no { background-color: #f8d7da; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #b8001d; }

        .event-card.is-public { border-left: 5px solid #28a745; }
        .event-card.is-private { border-left: 5px solid #dc3545; }

        @media (max-width: 600px) { .events-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default UserDashboard;
