import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
export const AUTH_KEY = "jt_auth";

function isExpired(token) {
  if (!token) return false;
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return typeof decoded.exp === "number" && decoded.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

function loadAuth() {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_KEY));
    if (auth?.token && isExpired(auth.token)) {
      localStorage.removeItem(AUTH_KEY);
      sessionStorage.setItem(
        "jt_session_message",
        "Your session expired. Please log in again."
      );
      return null;
    }
    return auth;
  } catch {
    return null;
  }
}

// Holds the logged-in user ({ token, name, email, role }) for the whole app.
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth);

  const login = (data) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
