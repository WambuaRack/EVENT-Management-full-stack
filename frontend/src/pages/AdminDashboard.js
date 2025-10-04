// src/pages/AdminDashboard.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    is_public: false,
    start_time: "",
    end_time: ""
  });

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  // Make sure this matches AuthContext storage
  const token = sessionStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/events/", { headers });
      setEvents(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to load events");
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/", { headers });
      setUsers(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to load users");
    }
  };

  // Load events and users after user is available
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchEvents(), fetchUsers()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Event actions
  const toggleEventPublic = async (eventId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/events/${eventId}/toggle_public/`, {}, { headers });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${eventId}/`, { headers });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) {
      alert("Please fill all required fields (Title, Start Time, End Time).");
      return;
    }
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/events/", newEvent, { headers });
      console.log("Event created:", res.data);
      setNewEvent({ title: "", description: "", location: "", is_public: false, start_time: "", end_time: "" });
      fetchEvents();
    } catch (err) {
      console.error("Failed to create event:", err.response?.data || err.message);
      alert("Failed to create event. Check console for details.");
    }
  };

  // User actions
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}/`, { headers });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const createUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Please fill all required user fields.");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register/", newUser, { headers });
      setNewUser({ username: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to create user.");
    }
  };

  if (!user) return <p>Please log in.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-dashboard">
      <h1>Event Management Web App</h1>

      {/* Events Section */}
      <section className="events-section">
        <h2>Events</h2>
        <div className="new-event-form">
          <input placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
          <input placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
          <input placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
          <label>
            Start Time:
            <input type="datetime-local" value={newEvent.start_time} onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })} />
          </label>
          <label>
            End Time:
            <input type="datetime-local" value={newEvent.end_time} onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })} />
          </label>
          <label>
            Public:
            <input type="checkbox" checked={newEvent.is_public} onChange={(e) => setNewEvent({ ...newEvent, is_public: e.target.checked })} />
          </label>
          <button className="create-btn" onClick={createEvent}>Add Event</button>
        </div>

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
                  <button onClick={() => toggleEventPublic(event.id)}>Toggle</button>
                  <button onClick={() => deleteEvent(event.id)}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users Section */}
      <section className="users-section">
        <h2>Users</h2>
        <div className="new-user-form">
          <input placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
          <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <input placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button className="create-btn" onClick={createUser}>Add User</button>
        </div>

        {users.length === 0 ? (
          <p>No users registered</p>
        ) : (
          <div className="table users-grid">
            <div className="table-row header">
              <span>Username</span>
              <span>Email</span>
              <span>Role</span>
              <span>Actions</span>
            </div>
            {users.map((u) => (
              <div key={u.id} className="table-row">
                <span>{u.username}</span>
                <span>{u.email}</span>
                <span>{u.role}</span>
                <span className="actions">
                  <button onClick={() => deleteUser(u.id)}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CSS */}
      <style jsx>{`
        .admin-dashboard { max-width: 1400px; margin: 0 auto; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(120deg, #fdfbfb, #ebedee); }
        h1 { text-align: center; font-size: 36px; margin-bottom: 50px; color: #2c3e50; text-shadow: 1px 1px 2px #bdc3c7; }
        section { margin-bottom: 60px; }
        section h2 { font-size: 28px; margin-bottom: 20px; color: #34495e; border-bottom: 3px solid #3498db; display: inline-block; padding-bottom: 5px; }
        .new-event-form, .new-user-form { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; align-items: center; }
        .new-event-form input, .new-user-form input, .new-user-form select { flex: 1 1 200px; padding: 10px 15px; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; }
        .create-btn { padding: 10px 20px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; background: linear-gradient(45deg, #4caf50, #66bb6a); color: white; transition: transform 0.2s; }
        .create-btn:hover { transform: scale(1.05); }
        .table { display: grid; border-collapse: collapse; width: 100%; box-shadow: 0 8px 16px rgba(0,0,0,0.1); border-radius: 10px; overflow: hidden; }
        .table-row { display: grid; grid-template-columns: repeat(7, 1fr); background: white; padding: 15px 20px; border-bottom: 1px solid #eee; align-items: center; }
        .table-row.header { background: #3498db; color: white; font-weight: bold; }
        .table-row .actions button { margin-right: 5px; padding: 5px 12px; border-radius: 6px; border: none; font-size: 14px; cursor: pointer; background: #e74c3c; color: white; transition: 0.2s; }
        .table-row .actions button:hover { background: #c0392b; }
        @media(max-width: 1024px){ .table-row { grid-template-columns: repeat(3, 1fr); } .table-row.header { display: none; } .table-row span { display: block; padding: 5px 0; } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
