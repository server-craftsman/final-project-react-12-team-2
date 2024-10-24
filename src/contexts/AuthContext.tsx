import { createContext, useContext, ReactNode, useState } from 'react';
import { UserRole } from '../models/User';

interface AuthContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole | null>(() => {
    // Initialize from localStorage
    const storedRole = localStorage.getItem("role");
    return storedRole as UserRole | null;
  });

  // Remove the useEffect that sets localStorage since it's handled in LoginPage
  
  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
