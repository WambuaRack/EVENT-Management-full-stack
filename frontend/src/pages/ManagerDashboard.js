import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ManagerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    is_public: true,
  });

  const token = localStorage.getItem("access");

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/events/", {
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

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  const handleOpenModal = (event = null) => {
    setCurrentEvent(event);
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        start_time: event.start_time,
        end_time: event.end_time,
        is_public: event.is_public,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        location: "",
        start_time: "",
        end_time: "",
        is_public: true,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentEvent) {
        await axios.put(
          `http://127.0.0.1:8000/api/events/${currentEvent.id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/events/",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      handleCloseModal();
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  if (!user) return <p>Please log in to view your dashboard.</p>;
  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>
      <button className="create-btn" onClick={() => handleOpenModal()}>
        + Create Event
      </button>

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p><strong>Location:</strong> {event.location || "N/A"}</p>
            <p><strong>Start:</strong> {new Date(event.start_time).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(event.end_time).toLocaleString()}</p>
            <p><strong>Public:</strong> {event.is_public ? "Yes" : "No"}</p>
            <div className="actions">
              <button onClick={() => handleOpenModal(event)}>Edit</button>
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{currentEvent ? "Edit Event" : "Create Event"}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
              <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} required />
              <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} required />
              <label>
                Public:
                <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleChange} />
              </label>
              <div className="modal-actions">
                <button type="submit">{currentEvent ? "Update" : "Create"}</button>
                <button type="button" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .manager-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(120deg, #f0f4f8, #d9e2ec);
        }
        h1 {
          text-align: center;
          font-size: 36px;
          margin-bottom: 30px;
          color: #2c3e50;
          text-shadow: 1px 1px 2px #bdc3c7;
        }
        .create-btn {
          display: block;
          margin: 0 auto 30px;
          padding: 12px 20px;
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
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .event-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        .event-card h2 {
          margin-top: 0;
          color: #34495e;
        }
        .actions {
          margin-top: 15px;
        }
        .actions button {
          margin-right: 10px;
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          color: white;
          transition: 0.2s;
        }
        .actions button:first-child {
          background: #3498db;
        }
        .actions button:first-child:hover {
          background: #2980b9;
        }
        .actions button:last-child {
          background: #e74c3c;
        }
        .actions button:last-child:hover {
          background: #c0392b;
        }
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right:0;
          bottom:0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          border-radius: 12px;
          padding: 25px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.2);
        }
        .modal input, .modal textarea {
          width: 100%;
          margin-bottom: 12px;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
        }
        .modal-actions button {
          margin-left: 10px;
          padding: 10px 15px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          color: white;
          transition: transform 0.2s;
        }
        .modal-actions button:first-child {
          background: #4caf50;
        }
        .modal-actions button:first-child:hover {
          transform: scale(1.05);
        }
        .modal-actions button:last-child {
          background: #e74c3c;
        }
        .modal-actions button:last-child:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ManagerDashboard;
