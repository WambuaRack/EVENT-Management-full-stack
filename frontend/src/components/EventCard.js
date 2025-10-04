import React from "react";

export default function EventCard({ event, onToggle, onRSVP, onEdit, onDelete, isManager }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg">{event.title}</h3>
      <p className="text-gray-600">{event.description}</p>
      <p className="text-sm text-gray-500">{event.location}</p>
      <p className="text-sm text-gray-500">
        {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">Created by: {event.created_by.username}</p>
      <p className="text-sm text-gray-500">Public: {event.is_public ? "Yes" : "No"}</p>

      <div className="flex gap-2 mt-2 flex-wrap">
        <button
          onClick={() => onRSVP(event.id)}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          RSVP
        </button>

        {isManager && (
          <>
            <button
              onClick={() => onToggle(event.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Toggle Public
            </button>
            <button
              onClick={() => onEdit(event)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
