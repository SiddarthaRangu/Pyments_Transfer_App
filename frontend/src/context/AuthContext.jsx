import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (!localStorage.getItem("token")) {
            setLoading(false);
            return;
        }
        try {
            const [uRes, bRes] = await Promise.all([
                api.get("/user/me"),
                api.get("/account/balance")
            ]);
            setUser(uRes.data.user);
            setBalance(bRes.data.balance);
        } catch (e) {
            console.error("Auth failed");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refreshData(); }, [refreshData]);

    return (
        <AuthContext.Provider value={{ user, balance, loading, refreshData }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);