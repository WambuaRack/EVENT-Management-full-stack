import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // block rendering until token check

  useEffect(() => {
    const token = sessionStorage.getItem("access"); // use sessionStorage
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          // Token valid
          setUser({
            id: decoded.user_id,
            role: decoded.role || "user",
            username: decoded.username || decoded.user
          });
        } else {
          // Token expired
          sessionStorage.removeItem("access");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        sessionStorage.removeItem("access");
      }
    }

    setLoading(false);
  }, []);

  // Login function
  const login = (accessToken) => {
    sessionStorage.setItem("access", accessToken);
    const decoded = jwtDecode(accessToken);
    setUser({
      id: decoded.user_id,
      role: decoded.role || "user",
      username: decoded.username || decoded.user
    });
  };

  // Logout function
  const logout = () => {
    sessionStorage.removeItem("access");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
