import { Navigate } from 'react-router-dom';
import {isUserAuthenticated} from "../utils/authService";

const ProtectedRoutes = ({ children }) => {
    const isAuthenticated = isUserAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoutes;