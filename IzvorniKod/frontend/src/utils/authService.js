
export const isUserAuthenticated = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return false;
    }

    const currentTime = Date.now() / 1000;
    if (token.exp < currentTime) {
        localStorage.removeItem('userToken');
        return false;
    }

    return true;
};


// import { isUserAuthenticated } from './authServices';