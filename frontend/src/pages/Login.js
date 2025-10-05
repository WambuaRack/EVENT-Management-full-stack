import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = "http://127.0.0.1:8000/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/token/`, { username, password });

      // Assuming your backend sends role and username in response
      const { access, role } = res.data;
      // Note: Assuming 'username' is also available in res.data if it's needed for context
      // If not, use the local 'username' state for the third argument.
      login(access, role, username); 

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h1>Event Management Web App</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p className="register-prompt">
        </p>
      </form>

      {/* Professional CSS Styling */}
      <style jsx>{`
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f4f7f9; /* Light background for contrast */
          font-family: 'Arial', sans-serif;
        }

        h1 {
          color: #2c3e50; /* Dark, professional color */
          margin-bottom: 20px;
          font-weight: 400;
        }

        .login-form {
          background: #ffffff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 380px;
          text-align: center;
        }

        .login-form h2 {
          margin-top: 0;
          margin-bottom: 25px;
          color: #34495e;
          font-size: 1.8em;
          font-weight: 500;
        }

        .login-form input {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 20px;
          border: 1px solid #dcdcdc;
          border-radius: 4px;
          box-sizing: border-box; /* Includes padding and border in the element's total width and height */
          font-size: 1em;
          transition: border-color 0.2s;
        }

        .login-form input:focus {
          border-color: #3498db; /* Focus highlight */
          outline: none;
        }

        .login-form button {
          width: 100%;
          padding: 12px;
          background-color: #3498db; /* Primary button color */
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1em;
          cursor: pointer;
          transition: background-color 0.2s, box-shadow 0.2s;
          margin-bottom: 15px;
        }

        .login-form button:hover {
          background-color: #2980b9; /* Slightly darker on hover */
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .register-prompt {
          font-size: 0.9em;
          color: #7f8c8d;
        }

        .register-prompt a {
          color: #3498db;
          text-decoration: none;
          font-weight: bold;
          transition: color 0.2s;
        }

        .register-prompt a:hover {
          color: #2980b9;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}