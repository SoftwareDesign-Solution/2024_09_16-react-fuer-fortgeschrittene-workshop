import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAccessToken } from "../../features/auth/authSlice";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    
    const accessToken = useSelector(getAccessToken);

    if (!accessToken) {
        return <Navigate to={'/login'} />;
    }

    return children;
};

export { ProtectedRoute };