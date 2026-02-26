import { createContext, use } from "react";

interface AuthContextValue {
  user: null;
  tenant: null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext
      value={{
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
        logout: async () => {},
      }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
