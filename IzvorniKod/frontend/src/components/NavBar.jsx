import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import myAccount from '../assets/my-account.png';
import logo from '../assets/CodeblazeLogo.png';
import './Navbar.css'
import {getNicknameFromToken} from "./RegisterScooterForm";
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import {getUserFromToken, getUserIdFromToken} from "../utils/authService";
import UnreadMessagesContext from "./UnreadMessagesContext";

function SocialMediaModal({ isOpen, onClose, platform, onSave }) {
    const [username, setUsername] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSave(platform, username);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Connect to {platform}</h3>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <div className="modal-button-container">
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
    function NavBar() {
        const navigate = useNavigate();
        const [admins, setAdmins] = useState([]);
        const [showDropdown, setShowDropdown] = useState(false);
        const [acceptedUsers, setAcceptedUsers] = useState([]);
        const [errorMessage, setErrorMessage] = useState('');
        const {unreadCount, setUnreadCount} = useContext(UnreadMessagesContext);
        const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);
        const [currentPlatform, setCurrentPlatform] = useState('');
        const [userRole, setUserRole] = useState(null);

        useEffect(() => {
            getUserFromToken().then(user => {

                setUserRole(user.role);  // Update state here
            }).catch(error => {
                console.error("Error fetching user:", error);
            });
            // Other useEffect content...
        }, []); // Empty dependency array to run only on component mount


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
            console.log(userRole);
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
                setState(data); // Setting the state with the fetched data

            } catch (error) {
                console.error("Failed to fetch users: ", error);
                setErrorMessage(error.message);
            }
        };


        const shareUrl = "window.location.href";

        const openSocialMediaShare = (platform) => {
            let url = '';

            switch (platform) {
                case 'Facebook':
                    url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                    break;
                case 'Twitter':
                    url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`;
                    break;
                case 'LinkedIn':
                    url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                    break;
                default:
                    console.error('Unsupported platform:', platform);
            }

            if (url) window.open(url, '_blank');
        };


        return (
            <header>
                <nav className="navbar">
                    <div className="navbar-logo" onClick={() => navigate('/')}>
                        <img src={logo} alt="Logo"/>
                    </div>
                    <ul className="navbar-links">
                        <li onClick={() => navigate('/home')}>Početna</li>
                        <li onClick={() => navigate('/scooters')}>Tvoji Romobili</li>
                        <li onClick={() => navigate('/chat-panel')}>
                            Poruke {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                        </li>
                        <li onClick={() => navigate('/my-transactions')}>Transakcije</li>
                        {userRole === 'ADMIN' && (
                            <li onClick={() => navigate('/admin-dashboard')}>Panel</li>
                        )}
                    </ul>

                    {localStorage.getItem('authToken') && (
                        <div className="social-media-buttons">
                            <FaFacebook onClick={() => openSocialMediaShare('Facebook')}/>
                            <FaTwitter onClick={() => openSocialMediaShare('Twitter')}/>
                            <FaLinkedin onClick={() => openSocialMediaShare('LinkedIn')}/>
                        </div>
                    )}
                    {localStorage.getItem('authToken') ? (
                        <div className="navbar-account">
                            <button onClick={toggleDropdown}>
                                <img src={myAccount} alt="My Account"/>
                                <span>{getNicknameFromToken()}</span>
                            </button>
                            {showDropdown && (
                                <div className="dropdown-menu" ref={dropdownRef}>
                                    <button onClick={() => navigate('/profile')}>Moj profil</button>
                                    <button onClick={handleLogout}>Odjava</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div className="navbar-login" onClick={() => navigate('/login')}>
                                Prijava
                            </div>
                            <div className="navbar-login" onClick={() => navigate('/register')}>
                                Registracija
                            </div>
                        </div>
                    )}
                </nav>
            </header>
        );

    }

export default NavBar;
