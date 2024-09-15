import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, password: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>({} as AuthContextType);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post("http://localhost:3001/login", {
                email: email,
                password: password,
            });

            console.log(response.data);
        
            setAccessToken(response.data.accessToken);
        } catch (error) {
            console.error(error);
        }
    };
    
    const logout = () => {
        setAccessToken(null);
    };
    
    const register = async (email: string, password: string) => {
        try {
            const response = await axios.post("http://localhost:3001/register", {
                email: email,
                password: password,
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    
    return context;
};

export { AuthProvider, useAuth };