import { Navigate } from 'react-router-dom';
import {getRoleFromToken } from "../utils/authService";

const ProtectedRouteScooter = ({ children }) => {
    const role = getRoleFromToken();
    if (role == "GUEST") {
        return <Navigate to="/profile-pending" />;
    }

    return children;
};

export default ProtectedRouteScooter;