import { createContext, useState, ReactNode } from "react";

type User = {
  email?: string;   
  username: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  bio?: string;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
