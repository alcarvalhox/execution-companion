import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  role: "ADM" | "Usuário";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Simulação de autenticação
    if (email && password) {
      const isAdmin = email === "marcelo.augusto@mrs.com.br";
      setUser({
        email,
        name: email.split("@")[0].replace(".", " "),
        role: isAdmin ? "ADM" : "Usuário",
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
