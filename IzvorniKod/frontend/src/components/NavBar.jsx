import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import myAccount from '../assets/my-account.png';
import logo from '../assets/CodeblazeLogo.png';
import './Navbar.css'
import {getNicknameFromToken} from "./RegisterScooterForm";
import { FaFacebook, FaInstagram, FaGoogle, FaTiktok } from 'react-icons/fa';


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
    const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);
    const [currentPlatform, setCurrentPlatform] = useState('');


    useEffect(() => {
        fetchUsers("/api/users/acceptedUsers", setAcceptedUsers);
        fetchUsers("/api/users/admins", setAdmins);
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

        const isAdmin = admins.some(admin => admin.nickname === getNicknameFromToken());

        if (isAdmin) {
            path = '/admin-home';
        }
        navigate(path);
    };

    const openSocialMediaModal = (platform) => {
        setCurrentPlatform(platform);
        setIsSocialMediaModalOpen(true);
    };

    const closeSocialMediaModal = () => {
        setIsSocialMediaModalOpen(false);
    };

    const handleSocialMediaSave = async (platform, username) => {
        console.log(`Saving ${platform} username: ${username}`);
        const nickname = getNicknameFromToken();

        try {
            const response = await fetch(`/api/${platform}/${nickname}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ platform, username }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Successfully saved:', result);
        } catch (error) {
            console.error('Error while saving social media details:', error);
        }
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
                    <li onClick={() => navigate('/chat-panel')}>Poruke</li>
                    <li onClick={() => navigate('/my-transactions')}>Transakcije</li>
                </ul>
                {localStorage.getItem('authToken') && (
                    <div className="social-media-buttons">
                        <FaFacebook onClick={() => openSocialMediaModal('Facebook')} />
                        <FaInstagram onClick={() => openSocialMediaModal('Instagram')} />
                        <FaGoogle onClick={() => openSocialMediaModal('Google')} />
                        <FaTiktok onClick={() => openSocialMediaModal('TikTok')} />
                    </div>
                )}
                <SocialMediaModal
                    isOpen={isSocialMediaModalOpen}
                    onClose={closeSocialMediaModal}
                    platform={currentPlatform}
                    onSave={handleSocialMediaSave}
                />
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
