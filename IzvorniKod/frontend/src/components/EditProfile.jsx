import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './MyProfile.css';
import {getNicknameFromToken} from "../utils/authService";

function EditProfile() {

    const [firstNameInput, setFirstNameInput] = useState('');
    const [lastNameInput, setLastNameInput] = useState('');
    const [nicknameInput, setNicknameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [phoneNumberInput, setPhoneNumberInput] = useState('');


    const handleFirstNameChange = (e) => {
        setFirstNameInput(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastNameInput(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmailInput(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        const newPhoneNumber = e.target.value;

        const isNumeric = /^\d+$/;

        if (isNumeric.test(newPhoneNumber)) {
            // If the new phone number contains only digits, update the state
            setPhoneNumberInput(newPhoneNumber);
        }
    };


    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [privacySettings, setPrivacySettings] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {

            const nickname = getNicknameFromToken();
            if (nickname) {
                try {
                    const response = await fetch(`/api/users/by-nickname/${nickname}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);

                        fetchPrivacySettings(userData.userId);
                    } else {
                        setErrorMessage('Unable to fetch user data.');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setErrorMessage('An error occurred while fetching user data.');
                }
            } else {
                setErrorMessage('No user token found. Please log in.');
            }
        };

        const fetchPrivacySettings = async (userId) => {
            try {

                //console.log("USER ID: ", userId);
                const response = await fetch(`/api/privacy-settings/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const settings = await response.json();
                    //console.log("privacy settings pri kliku na account: ");
                    //console.log(settings);
                    setPrivacySettings(settings);
                } else {
                    setErrorMessage('Unable to fetch privacy settings.');
                }
            } catch (error) {
                console.error('Error fetching privacy settings:', error);
                setErrorMessage('An error occurred while fetching privacy settings.');
            }
        };




        fetchUserData();
    }, []);




    if (errorMessage) {
        return <div>Error: {errorMessage}</div>;
    }

    if (!user || !privacySettings) {
        return <div>Loading user data...</div>;
    }

    const doNotSave = () => {
        navigate('/profile');
    };

    const save = async () => {

        try {
            const response = await fetch('/api/users/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include the JWT token for authentication
                },
                body: JSON.stringify({
                    userId: user.userId, // Make sure to include the user's ID for identification
                    firstName: firstNameInput.trim() !== '' ? firstNameInput : user.firstName/* Updated first name from the input field */,
                    lastName: lastNameInput.trim() !== '' ? lastNameInput : user.lastName/* Updated last name from the input field */,
                    nickname: nicknameInput.trim() !== '' ? nicknameInput : user.nickname,
                    email: emailInput.trim() !== '' ? emailInput : user.email,
                    phoneNumber: phoneNumberInput.trim() !== '' ? phoneNumberInput : user.phoneNumber,
                }),
            });

            if (response.ok) {
                navigate('/');
            } else {
                const data = await response.json();
                console.error('Profile update failed:', data.message);
                // Handle error, show error message, etc.
            }
        } catch (error) {
            console.error('Profile update error:', error);
            // Handle error, show error message, etc.
        }
    };




    return (
        <div>
            <div className="container">
                <div className="title">Osobne informacije</div>
                <div className="infoSection">
                    <div className="infoRow">
                        <span className="infoLabel">Ime:</span>
                        <input
                            type="text"
                            value={firstNameInput} // Bind input value to state
                            onChange={handleFirstNameChange} // Handle input change
                        />
                        <span className="infoValue">{user.firstName}</span>
                    </div>
                    <div className="infoRow">
                        <span className="infoLabel">Prezime:</span>
                        <input
                            type="text"
                            value={lastNameInput}
                            onChange={handleLastNameChange}
                        />
                        <span className="infoValue">{user.lastName}</span>
                    </div>
                    {/*<div className="infoRow">
                        <span className="infoLabel">Nadimak:</span>
                        <input
                            type="text"
                            value={nicknameInput} // Bind input value to state
                            onChange={handleNicknameChange} // Handle input change
                        />
                        <span className="infoValue">{user.nickname}</span>
                    </div>*/}
                </div>


                <div className="title">Kontakt podaci</div>
                <div className="infoSection">
                    <div className="infoRow">
                        <span className="infoLabel">Email:</span>
                        <input
                            type="text"
                            value={emailInput} // Bind input value to state
                            onChange={handleEmailChange} // Handle input change
                        />
                        <span className="infoValue">{user.email}</span>
                    </div>
                    <div className="infoRow">
                        <span className="infoLabel">Broj mobitela:</span>
                        <input
                            type="text"
                            value={phoneNumberInput} // Bind input value to state
                            onChange={handlePhoneNumberChange} // Handle input change
                        />
                        <span className="infoValue">{user.phoneNumber}</span>
                    </div>
                </div>


                <div className="infoSection">
                    <div className="buttonRow">
                        <button onClick={save}>Spremi</button>
                    </div>
                    <div className="buttonRow">
                        <button className="deleteButton" onClick={doNotSave} >Odustani</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;