import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import myAccount from '../assets/my-account.png';
import logo from '../assets/CodeblazeLogo.png';
import {getNicknameFromToken} from "./RegisterScooterForm";
import {getUserIdFromToken} from "../utils/authService";
import UnreadMessagesContext from "./UnreadMessagesContext";

function NavBar() {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [acceptedUsers, setAcceptedUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { unreadCount, setUnreadCount } = useContext(UnreadMessagesContext);


    useEffect(() => {
        fetchUsers("/api/users/acceptedUsers", setAcceptedUsers);
        fetchUsers("/api/users/admins", setAdmins);
        fetchChats();
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
        setUnreadCount(0);
        navigate('/login');
    };

    const fetchChats = async () => {
        try {
            const userId = await getUserIdFromToken();
            if (userId != null) {
                const receiverNickname = await getNicknameFromToken();
                const response = await fetch(`/api/chat-session/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const chatMessagesPromises = data.map(chat =>
                    fetch(`/api/messages/session/${chat.chatSessionId}`)
                        .then(response => response.json())
                );

                const chatMessages = await Promise.all(chatMessagesPromises);

                let unreadMessagesCount = 0;
                chatMessages.forEach(chatMessages => {
                    chatMessages.forEach(message => {
                        if (message.status === "UNREAD" && message.senderUsername !== receiverNickname) {
                            unreadMessagesCount++;
                        }
                    });
                });

                setUnreadCount(unreadMessagesCount);
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
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

        const isAdmin = admins.some(admin => admin.nickname === getNicknameFromToken());

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
                    <li onClick={handleNavigation}>Početna</li>
                    <li onClick={() => navigate('/scooters')}>Tvoji Romobili</li>
                    <li onClick={() => navigate('/chat-panel')}>
                        Poruke {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                    </li>
                </ul>
                {localStorage.getItem('authToken') ? (
                    <div className="navbar-account">
                        <button onClick={toggleDropdown}>
                            <img src={myAccount} alt="My Account" />
                            <span>{getNicknameFromToken()}</span>
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
