// src/components/Dashboard.jsx
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://127.0.0.1:8000/api/events/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // handle DRF paginated or plain array response
        setEvents(
          Array.isArray(response.data) ? response.data : response.data.results || []
        );
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      }
    };

    if (user) fetchEvents();
  }, [user]);

  if (!user) return <p className="status-message">Please login to view dashboard.</p>;

  // Determine the role for the heading and card styling
  const role = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const roleClass = user.role.toLowerCase();

  return (
    <div className={`dashboard-container ${roleClass}`}>
      <h1 className="dashboard-title">{role} Dashboard</h1>

      {events.length === 0 ? (
        <div className="no-events-message">
          <p>No events are currently available.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p className="event-description">{event.description}</p>
              
              <div className="event-details">
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Start:</strong> {new Date(event.start_time).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(event.end_time).toLocaleString()}</p>
                <p><strong>Created By:</strong> {event.created_by?.username || "N/A"}</p>
                <p className="status-indicator">
                    <strong>Public:</strong> 
                    <span className={event.is_public ? 'public-yes' : 'public-no'}>
                      {event.is_public ? "Yes" : "No"}
                    </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded CSS Styling */}
      <style jsx>{`
        /* --- General Layout and Background Gradient --- */
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          /* Subtle Background Gradient */
          background: linear-gradient(135deg, #f0f4f8 0%, #e5ebf1 100%);
        }

        .dashboard-title {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2em;
          font-weight: 600;
          color: #007bff; /* Primary Blue for Heading */
        }

        /* --- Status Messages --- */
        .status-message {
            text-align: center;
            padding: 40px 20px;
            font-size: 1.1em;
        }

        .no-events-message {
          text-align: center;
          padding: 30px;
          border: 1px dashed #ccc;
          border-radius: 8px;
          background-color: #ffffff;
          color: #777;
          font-style: italic;
          margin-top: 30px;
        }

        /* --- Events Grid --- */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 20px;
        }

        /* --- Event Card --- */
        .event-card {
          border-radius: 10px;
          padding: 20px;
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          height: 100%; /* Important for grid alignment */
        }

        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .event-card h2 {
          color: #343a40;
          margin-top: 0;
          font-size: 1.3em;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        
        .event-description {
            flex-grow: 1; 
            margin-bottom: 15px;
            color: #555;
            line-height: 1.4;
        }

        .event-details p {
          margin: 5px 0;
          font-size: 0.95em;
        }
        
        .event-details strong {
            color: #495057; 
            margin-right: 5px;
        }
        
        /* --- Status Indicator Styling --- */
        .status-indicator {
            padding-top: 10px;
            margin-top: 10px;
            border-top: 1px solid #f0f0f0;
        }

        .public-yes {
            color: #1e7e34;
            font-weight: 600;
            background-color: #d4edda;
            padding: 2px 7px;
            border-radius: 3px;
        }

        .public-no {
            color: #b8001d;
            font-weight: 600;
            background-color: #f8d7da;
            padding: 2px 7px;
            border-radius: 3px;
        }
        
        /* --- Responsive Adjustments --- */
        @media (max-width: 650px) {
            .dashboard-container {
                padding: 20px 15px;
            }
            .events-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;