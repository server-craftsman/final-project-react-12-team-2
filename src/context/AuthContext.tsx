import { createContext, useState } from "react";
import { User, UserRole } from "../models/User"; // Import the User type

// Update the context type to include role
const AuthContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  role: UserRole | null;
  setRole: React.Dispatch<React.SetStateAction<UserRole | null>>;
  login: (user: User, userRole: UserRole) => void;
}>({
  user: null,
  setUser: () => {},
  role: null,
  setRole: () => {},
  login: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const login = (user: User, userRole: UserRole) => {
    setUser(user);
    setRole(userRole);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, role, setRole, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
