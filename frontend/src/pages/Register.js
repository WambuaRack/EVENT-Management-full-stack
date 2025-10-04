import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Added Link for a navigation option

const API = "http://127.0.0.1:8000/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/register/`, { username, email, password });
      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      alert("Error registering user. Please check your inputs.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h1 className="form-title">Create Account</h1>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" className="register-button">
          Register
        </button>

        <p className="login-prompt">
            Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>

      {/* Professional CSS Styling */}
      <style jsx>{`
        /* Container and Layout */
        .register-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f4f7f9; /* Light background */
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Form Card */
        .register-form {
          background: #ffffff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 380px;
          text-align: center;
        }

        .form-title {
          font-size: 2em;
          font-weight: 500;
          color: #34495e;
          margin-bottom: 30px;
        }

        /* Form Inputs */
        .register-form input {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 18px;
          border: 1px solid #dcdcdc;
          border-radius: 4px;
          box-sizing: border-box; 
          font-size: 1em;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .register-form input:focus {
          border-color: #2ecc71; /* Focus highlight color (Success Green) */
          box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
          outline: none;
        }

        /* Button Styling */
        .register-button {
          width: 100%;
          padding: 12px;
          background-color: #2ecc71; /* Primary success color */
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 5px;
        }

        .register-button:hover {
          background-color: #27ae60; /* Slightly darker on hover */
        }

        /* Link/Prompt Styling */
        .login-prompt {
          font-size: 0.9em;
          color: #7f8c8d;
          margin-top: 20px;
        }

        .login-prompt a {
          color: #2ecc71;
          text-decoration: none;
          font-weight: bold;
          transition: color 0.2s;
        }

        .login-prompt a:hover {
          color: #27ae60;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}