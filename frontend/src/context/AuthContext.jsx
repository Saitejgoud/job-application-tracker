import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
export const AUTH_KEY = "jt_auth";

function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
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
