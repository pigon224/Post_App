// src/context/UserContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Create a context for user state
const UserContext = createContext<any>(null);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  // State to hold user data
  const [user, setUser] = useState(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem("token");
    return token ? { token } : null; // If token exists, user is logged in
  });

  // UseEffect to update the user state if the token changes in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); // Update context when token is present in localStorage
    }
  }, []); // Empty dependency array means this effect runs once on initial load

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => useContext(UserContext);
