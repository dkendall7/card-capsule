import React, { createContext, useContext, useState, useCallback, type PropsWithChildren } from 'react';

type SessionContextValue = {
  signIn: () => void;
  signOut: () => void;
  session: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const signIn = useCallback(() => {
    setSession('mock-session');
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
  }, []);

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        signIn,
        signOut,
        session,
        isLoading,
      },
    },
    children
  );
}
