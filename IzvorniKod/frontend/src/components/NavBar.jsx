import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import myAccount from '../assets/my-account.png';
import logo from '../assets/CodeblazeLogo.png';
import { jwtDecode } from 'jwt-decode';

function NavBar() {
    const navigate = useNavigate();
    const [loggedUserNickname, setLoggedUserNickname] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [acceptedUsers, setAcceptedUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchUsers("http://localhost:8080/api/users/acceptedUsers", setAcceptedUsers);
        fetchUsers("http://localhost:8080/api/users/admins", setAdmins);
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Corrected usage
                setLoggedUserNickname(decodedToken.nickname);
            } catch (error) {
                console.error("Error decoding token: ", error);
            }
        }
    }, []);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const closeDropdown = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', closeDropdown);

        return () => document.removeEventListener('mousedown', closeDropdown);
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const fetchUsers = async (url, setState) => {
        setErrorMessage(''); // Resetting the error message

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error in AdminDashboard: ${response.status}`);
            }


            const data = await response.json();
            console.log("DATA");
            console.log(data);
            setState(data); // Setting the state with the fetched data

        } catch (error) {
            console.error("Failed to fetch users: ", error);
            setErrorMessage(error.message);
        }
    };


    const handleNavigation = () => {
        let path = '/';

        const isAdmin = admins.some(admin => admin.nickname === loggedUserNickname);

        if (isAdmin) {
            path = '/admin-home';
        }
        navigate(path);
    };

    return (
        <header>
            <nav className="navbar">
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo" />
                </div>
                <ul className="navbar-links">
                    <li onClick={(handleNavigation)}>Početna</li>
                    <li onClick={() => navigate('/scooters')}>Moji Romobili</li>
                    <li onClick={() => navigate('/chat-panel')}>Poruke</li>
                </ul>
                {localStorage.getItem('authToken') ? (
                    <div className="navbar-account">
                        <button onClick={toggleDropdown}>
                            <img src={myAccount} alt="My Account" />
                            <span>{loggedUserNickname}</span>
                        </button>
                        {showDropdown && (
                            <div className="dropdown-menu" ref={dropdownRef}>
                                <button onClick={() => navigate('/profile')}>My Account</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="navbar-login" onClick={() => navigate('/login')}>
                            Login
                        </div>
                        <div className="navbar-login" onClick={() => navigate('/register')}>
                            Register
                        </div>
                    </div>
                )}
            </nav>
        </header>

    );
}


export default NavBar;
