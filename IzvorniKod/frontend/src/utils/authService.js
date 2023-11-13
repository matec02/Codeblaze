import { jwtDecode } from 'jwt-decode';

export const isUserAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log("Token is invalid");
        return false;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('authToken');
            return false;
        }

        return true;
    } catch (error) {
        // Handle the error if the token is invalid or expired
        localStorage.removeItem('authToken');
        return false;
    }
};

export const getRoleFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.role;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const isAdmin = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return false;
    }
    let currentRole = getRoleFromToken();
    console.log("Current Role: ", currentRole);
    if (currentRole === "ADMIN") {
        return true;
    }
    return false
};