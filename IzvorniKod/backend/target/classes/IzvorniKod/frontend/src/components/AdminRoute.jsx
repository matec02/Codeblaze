import { Navigate } from 'react-router-dom';
import { isUserAuthenticated, isAdmin } from "../utils/authService";

const AdminRoute = ({ children }) => {
    const admin = isAdmin()
    const isAuthenticated = isUserAuthenticated();
    if (!isAuthenticated || !admin) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default AdminRoute;