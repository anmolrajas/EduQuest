import { createContext, useState, useEffect } from "react";
import axios from "axios";
import authService from "../service/authService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await authService.check();
                console.log("user:- ", res.user);
                if (res.user) {
                    setUser(res.user);
                }
            } catch (error) {
                console.log("User not authenticated");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
