import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);

                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                    // Setting a simplified user object for the frontend
                    setUser({
                        email: decoded.sub,
                        username: localStorage.getItem('username'),
                        token
                    });
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (token, email, username) => {
        localStorage.setItem('token', token);
        if (username) localStorage.setItem('username', username);
        setUser({ email, username, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
