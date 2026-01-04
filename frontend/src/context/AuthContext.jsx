import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setBalance(null);
      setLoading(false);
      return;
    }

    try {
      const [uRes, bRes] = await Promise.all([
        api.get("/user/me"),
        api.get("/account/balance"),
      ]);

      setUser(uRes.data.user);
      setBalance(bRes.data.balance);
    } catch (e) {
      console.error("Auth failed, clearing stale session");
      localStorage.removeItem("token");
      setUser(null);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        balance,
        loading,
        refreshData,
        setUser,
        setBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
