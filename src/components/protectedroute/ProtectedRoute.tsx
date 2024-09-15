import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    
    const { accessToken } = useAuth();

    if (!accessToken) {
        return <Navigate to={'/login'} />;
    }

    return children;
};

export { ProtectedRoute };