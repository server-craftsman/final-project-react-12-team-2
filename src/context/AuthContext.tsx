import { createContext, useState, useEffect } from "react";
import { User, UserRole } from "../models/User"; // Import the User type
import usersData from "../data/users.json"; // Import users data

// Update the context type
const AuthContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => User | null;
}>({ user: null, setUser: () => {}, login: () => null });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (email: string, password: string): User | null => {
    const foundUser = usersData.users.find(
      (u) => u.email === email && u.password === password,
    );
    if (foundUser) {
      const userWithCorrectRole: User = {
        ...foundUser,
        role: foundUser.role.toUpperCase() as UserRole,
        dob: new Date(foundUser.dob),
      };
      setUser(userWithCorrectRole);
      return userWithCorrectRole;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
