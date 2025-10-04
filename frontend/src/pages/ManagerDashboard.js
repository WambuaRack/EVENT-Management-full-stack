import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EventManagerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    is_public: false,
    start_time: "",
    end_time: "",
  });

  const token = sessionStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/events/", { headers });
      setEvents(Array.isArray(res.data) ? res.data : res.data.results || []);
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

  // Create new event
  const createEvent = async () => {
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) {
      alert("Please fill all required fields (Title, Start Time, End Time).");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/api/events/", newEvent, { headers });
      setNewEvent({
        title: "",
        description: "",
        location: "",
        is_public: false,
        start_time: "",
        end_time: "",
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to create event.");
    }
  };

  // Update existing event
  const updateEvent = async (id, updatedEvent) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/events/${id}/`, updatedEvent, { headers });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to update event.");
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${id}/`, { headers });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  if (!user) return <p>Please log in.</p>;
  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="event-manager-dashboard">
      <h1>Welcome, {user.username}</h1>
      <h2>Manage Events</h2>

      {/* Create Event Form */}
      <div className="new-event-form">
        <input
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        />
        <input
          placeholder="Location"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        />
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={newEvent.start_time}
            onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
          />
        </label>
        <label>
          End Time:
          <input
            type="datetime-local"
            value={newEvent.end_time}
            onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
          />
        </label>
        <label>
          Public:
          <input
            type="checkbox"
            checked={newEvent.is_public}
            onChange={(e) => setNewEvent({ ...newEvent, is_public: e.target.checked })}
          />
        </label>
        <button className="create-btn" onClick={createEvent}>
          Add Event
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <div className="table events-grid">
          <div className="table-row header">
            <span>Title</span>
            <span>Description</span>
            <span>Location</span>
            <span>Start</span>
            <span>End</span>
            <span>Public</span>
            <span>Actions</span>
          </div>
          {events.map((event) => (
            <div key={event.id} className="table-row">
              <span>{event.title}</span>
              <span>{event.description}</span>
              <span>{event.location}</span>
              <span>{new Date(event.start_time).toLocaleString()}</span>
              <span>{new Date(event.end_time).toLocaleString()}</span>
              <span>{event.is_public ? "Yes" : "No"}</span>
              <span className="actions">
                <button
                  onClick={() => {
                    const updated = { ...event, is_public: !event.is_public };
                    updateEvent(event.id, updated);
                  }}
                >
                  Toggle
                </button>
                <button onClick={() => deleteEvent(event.id)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CSS */}
      <style jsx>{`
        .event-manager-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(120deg, #fdfbfb, #ebedee);
        }
        h1 {
          text-align: center;
          font-size: 32px;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        h2 {
          text-align: center;
          font-size: 24px;
          margin-bottom: 30px;
          color: #34495e;
        }
        .new-event-form {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
          align-items: center;
        }
        .new-event-form input {
          flex: 1 1 200px;
          padding: 10px 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
        }
        .create-btn {
          padding: 10px 20px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: linear-gradient(45deg, #4caf50, #66bb6a);
          color: white;
          transition: transform 0.2s;
        }
        .create-btn:hover {
          transform: scale(1.05);
        }
        .table {
          display: grid;
          border-collapse: collapse;
          width: 100%;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }
        .table-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: white;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          align-items: center;
        }
        .table-row.header {
          background: #3498db;
          color: white;
          font-weight: bold;
        }
        .table-row .actions button {
          margin-right: 5px;
          padding: 5px 12px;
          border-radius: 6px;
          border: none;
          font-size: 14px;
          cursor: pointer;
          background: #e74c3c;
          color: white;
          transition: 0.2s;
        }
        .table-row .actions button:hover {
          background: #c0392b;
        }
      `}</style>
    </div>
  );
};

export default EventManagerDashboard;
