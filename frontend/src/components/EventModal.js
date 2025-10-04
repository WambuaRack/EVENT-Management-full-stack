import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EventModal({ open, onClose, refresh, editEvent }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const API = "http://127.0.0.1:8000/api";

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description);
      setLocation(editEvent.location);
      setStart(new Date(editEvent.start_time).toISOString().slice(0,16));
      setEnd(new Date(editEvent.end_time).toISOString().slice(0,16));
    } else {
      setTitle(""); setDescription(""); setLocation(""); setStart(""); setEnd("");
    }
  }, [editEvent]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("access");
    const data = { title, description, location, start_time: start, end_time: end };

    try {
      if (editEvent) {
        await axios.put(`${API}/events/${editEvent.id}/`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/events/`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      refresh();
      onClose();
    } catch (err) {
      alert("Operation failed: " + err.response?.data?.detail || err.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">{editEvent ? "Edit Event" : "Create Event"}</h2>
        <input type="text" placeholder="Title" className="border p-2 mb-2 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" className="border p-2 mb-2 w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="Location" className="border p-2 mb-2 w-full" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="datetime-local" className="border p-2 mb-2 w-full" value={start} onChange={(e) => setStart(e.target.value)} />
        <input type="datetime-local" className="border p-2 mb-2 w-full" value={end} onChange={(e) => setEnd(e.target.value)} />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">{editEvent ? "Save" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}
