import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  signInWithGoogle,
  signOutUser,
  subscribeAuthState,
} from "../services/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeAuthState(
      (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
        setAuthError("");
      },
    );

    return unsubscribe;
  }, []);

  async function login() {
    try {
      setAuthError("");
      await signInWithGoogle();
    } catch (error) {
      console.error("Google 로그인 실패:", error);
      setAuthError(
        "Google 로그인에 실패했습니다.",
      );
    }
  }

  async function logout() {
    try {
      setAuthError("");
      await signOutUser();
    } catch (error) {
      console.error("로그아웃 실패:", error);
      setAuthError("로그아웃에 실패했습니다.");
    }
  }

  const value = useMemo(
    () => ({
      user,
      authLoading,
      authError,
      login,
      logout,
    }),
    [user, authLoading, authError],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth는 AuthProvider 안에서 사용해야 합니다.",
    );
  }

  return context;
}